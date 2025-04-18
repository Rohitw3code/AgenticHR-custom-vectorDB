from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
import os


# Initialize Groq LLM
llm = ChatGroq(
    model_name="llama3-8b-8192",
    api_key="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",
    temperature=0.5
)

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
    """Match the following job summary to the candidate's resume and provide a match score (0-100) with a brief explanation of how the candidate's skills align with the job requirements:

    Job Summary: {job_summary}
    Resume: {resume}

    Output format:
    Match Score: [Score]
    Explanation: [Explanation]"""
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

