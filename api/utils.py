from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

# Set your Groq API key
groq_api_key = "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"  

def job_summurizer(job_description):
    # Initialize the Groq chat model
    chat = ChatGroq(
        api_key=groq_api_key,
        model="llama3-70b-8192",  # Use a suitable Groq model
        temperature=0.3,  # Control randomness
        max_tokens=150  # Limit response length
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
    print("Summary:")
    return summary.content

