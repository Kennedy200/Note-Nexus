from fastapi import HTTPException, status

def validate_caleb_email(email: str):
    domain = "@calebuniversity.edu.ng"
    if not email.lower().endswith(domain):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access Denied. Only {domain} emails are allowed."
        )
    return True

# Example Reward Logic
UPLOAD_REWARD = 5
VERIFICATION_BONUS = 3