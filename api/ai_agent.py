from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from typing import Optional
from typing_extensions import Annotated, TypedDict
import os

# Initialize Groq LLM
llm = ChatGroq(
    model_name="llama3-8b-8192",
    api_key="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",
    temperature=0.5
)

# Define TypedDict for structured output
class MatchScores(TypedDict):
    """Match scores for candidate evaluation."""
    experience_score: Annotated[int, ..., "Score for experience alignment (0-100)"]
    skills_score: Annotated[int, ..., "Score for skills alignment (0-100)"]
    education_score: Annotated[int, ..., "Score for education alignment (0-100)"]
    other_score: Annotated[int, ..., "Score for other requirements (0-100)"]

# Create structured LLM
match_score_structured_llm = llm.with_structured_output(MatchScores)

# Define LangChain Prompts and Chains for Each Task
# Summarization Chain
summarize_prompt = ChatPromptTemplate.from_template(
    """Summarize the following job description into key points, including role, responsibilities, and qualifications, in bullet points:

    Job Description: {job_description}

    Output format:
    - Role: [Role]
    - Responsibilities: [Responsibilities]
    - Qualifications: [Qualifications]"""
)
summarize_chain = LLMChain(llm=llm, prompt=summarize_prompt)

# Candidate Matching Chain
match_prompt = ChatPromptTemplate.from_template(
    """Match the following job description to the candidate's resume text and provide four separate match scores (0-100) for experience, skills, education, and other requirements (e.g., certifications, soft skills) specified in the job description.

    Job Description: {job_description}
    Resume Text: {resume_text}

    Output format:
    Experience Score: [Score]
    Skills Score: [Score]
    Education Score: [Score]
    Other Score: [Score]"""
)
match_chain = LLMChain(llm=llm, prompt=match_prompt)

# Summarization Chain (Resume)
summarize_resume_prompt = ChatPromptTemplate.from_template(
    """Summarize the following resume into key points, including experience, skills, and education. Extract relevant data such as years of experience and specific skills for matching purposes.

    Resume: {resume}

    Output format:
    - Experience: [Summary of work experience, including years]
    - Skills: [List of key skills]
    - Education: [Summary of educational qualifications]
    - Extracted Data:
      - Years of Experience: [Number]
      - Specific Skills: [Comma-separated list]"""
)
summarize_resume_chain = LLMChain(llm=llm, prompt=summarize_resume_prompt)

# Interview Scheduling Chain
schedule_prompt = ChatPromptTemplate.from_template(
    """Propose three specific interview time slots (date and time) for a candidate, considering the job urgency: '{urgency}'. Provide a brief justification for the urgency.

    Output format:
    - [Date, Time]: [Justification]
    - [Date, Time]: [Justification]
    - [Date, Time]: [Justification]"""
)
schedule_chain = LLMChain(llm=llm, prompt=schedule_prompt)

# Define TypedDict for structured output
class SelectedCandidates(TypedDict):
    """List of selected candidate IDs."""
    candidate_ids: list[str]

# Create structured LLM
filter_prompt_structured_llm = llm.with_structured_output(SelectedCandidates)

# Enhanced Filter Candidates Prompt with job_data and analysis instruction
filter_prompt = ChatPromptTemplate.from_template(
    """You are an expert recruiter selecting candidates for a job based on their match scores. 
    Each candidate has a JSON match score with four fields: experience_score, skills_score, education_score, and other_score (all 0-100). 
    Your task is to evaluate which candidates are the best fit for the given job role by qualitatively analyzing their scores.

    Job Description:
    {job_data}

    Candidates:
    {candidates_json}

    Instructions:
    - Carefully analyze each candidate based on how well their scores align with the job role.
    - Consider the balance and relevance of all scores for the job requirements.
    - Do not perform any mathematical calculations like averaging.
    - Make a holistic judgment considering all score dimensions and how they relate to the job.

    Your Response:
    - First analyze and filter out any clearly unsuitable candidates.
    - From the remaining ones, choose up to 2 candidate IDs who are the best fit.
    - Provide the IDs of the selected candidates in the following JSON format:

    ```json
    {{
      "candidate_ids": ["<id1>", "<id2>"]
    }}
    ```
    If no candidates are suitable, return an empty list. Limit the max to 2 only.
    """
)