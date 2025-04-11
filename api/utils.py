from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

# Set your Groq API key
groq_api_key = "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"

def compute_match_score(resume_text, job_description):
    if not resume_text or not job_description:
        return 0.0
    
    vectorizer = TfidfVectorizer(stop_words='english')
    try:
        tfidf = vectorizer.fit_transform([resume_text, job_description])
        similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
        return float(similarity)
    except Exception as e:
        print(f"Error computing match score: {e}")
        return 0.0

def job_summurizer(job_description):
    # Initialize the Groq chat model
    chat = ChatGroq(
        api_key=groq_api_key,
        model="llama3-70b-8192",
        temperature=0.3,
        max_tokens=150
    )

    # Define the prompt template
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant that summarizes job descriptions."),
        ("user", "Summarize the following job description into a concise paragraph that includes the job title, key responsibilities, and required qualifications:\n\n{description}")
    ])

    # Create a chain to process the input
    chain = prompt | chat

    # Generate and print the summary
    summary = chain.invoke({"description": job_description})
    return summary.content