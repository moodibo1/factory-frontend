import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

# الصلاحيات ومعرف الفولدر
SCOPES = ['https://www.googleapis.com/auth/drive.file']
TARGET_FOLDER_ID = '1LoXsEP3ub7tOGkgIUdMSxI6LKc9IJjwx'

# تحديد مسار مجلد drive ديناميكياً لتجنب مشاكل المسارات
DIR_PATH = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_PATH = os.path.join(DIR_PATH, 'credentials.json')
TOKEN_PATH = os.path.join(DIR_PATH, 'token.json')
IMAGE_PATH = os.path.join(DIR_PATH, 'test_image.png') 

def authenticate():
    creds = None
    # الكود سيبحث عن ملف token.json في مساره الصحيح
    if os.path.exists(TOKEN_PATH):
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    
    # طلب الإذن من المتصفح إذا لم يكن هناك تصريح
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_PATH, SCOPES)
            creds = flow.run_local_server(port=0)
        # حفظ التصريح في مجلد drive
        with open(TOKEN_PATH, 'w') as token:
            token.write(creds.to_json())
    return creds

def upload_to_drive(file_path, file_name, folder_id):
    try:
        creds = authenticate()
        service = build('drive', 'v3', credentials=creds)
        
        file_metadata = {'name': file_name, 'parents': [folder_id]}
        media = MediaFileUpload(file_path, resumable=True)
        
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, webViewLink'
        ).execute()

        print(f"✅ تم الرفع بنجاح!")
        print(f"🔗 رابط الملف: {file.get('webViewLink')}")
        
    except Exception as e:
        print(f"❌ حدث خطأ أثناء الرفع: {e}")

if __name__ == '__main__':
    upload_to_drive(IMAGE_PATH, 'D1_Test_OAuth.png', TARGET_FOLDER_ID)