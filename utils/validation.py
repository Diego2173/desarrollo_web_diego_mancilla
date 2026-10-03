import re
from datetime import datetime, timedelta
import filetype

TEXT_RE  = re.compile(r'^[^\W\d_]+(?:[ "\-][^\W\d_]+)*$', re.UNICODE)
EMAIL_RE = re.compile(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
PHONE_RE = re.compile(r'^[0-9]+(?:[ -][0-9]+)*$')
ADDR_RE  = re.compile(r'^[a-zA-Z0-9\s.,\-#°ñÑáéíóúÁÉÍÓÚ]+$')
TIME_RE  = re.compile(r'^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')

MAX_FILE_BYTES = 20 * 1024 * 1024
MAX_FILES      = 10

# --- Functions for both forms ---
# function to validate a writtable field. It has a length restriction and a regular expression restriction
def validate_field(value, regex, minLength=0, maxLength=100, allow_empty=False):
    if value is None:
        return allow_empty and minLength == 0
    trimmed = value.strip()
    if not trimmed:
        return allow_empty and minLength == 0
    format_valid = regex.match(trimmed) is not None
    length_valid = minLength <= len(trimmed) <= maxLength
    return format_valid and length_valid
 
# function to validate a select field doesn't have the placeholder value
def validate_type(value):
    if not value:
        return False
    return True

# --- functions for Avistamiento ---
# function to validate time
def validate_time(value):
    if not value:
        return False
    return TIME_RE.match(value) is not None
 
# function to validate a date (with hours)
def validate_date(date_str, time_str):
    if not date_str or not validate_time(time_str):
        return False
 
    # Combine date and hours
    try:
        dateTime = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
    except ValueError:
        # If the date isn't valid, return False
        return False
 
    # Current datetime
    dateNow = datetime.now().replace(second=0, microsecond=0)
 
    # Calculate the limit date
    minDate = dateNow - timedelta(days=5 * 365 + 1)
    
    return dateTime <= dateNow and dateTime >= minDate
 
# Function to validate files (only imgs and videos)
def validate_file(img):
    ALLOWED_EXTENSIONS =  {"png", "jpg", "jpeg", "gif", "webp", "mp4", "mov"}
    ALLOWED_MIMETYPES  = {"image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/quicktime"}
 
    if (img is None) or (img.filename == ""):
        return False
 
    # Limit of 20 MB per file
    img.stream.seek(0, 2)
    size = img.stream.tell()
    img.stream.seek(0)
    if size > MAX_FILE_BYTES:
        return False
 
    # Se detecta el tipo real mirando el contenido, no el nombre del archivo
    ftype_guess = filetype.guess(img)
    if ftype_guess is None:
        return False
    if (ftype_guess.extension not in ALLOWED_EXTENSIONS) or (ftype_guess.mime not in ALLOWED_MIMETYPES):
        return False
 
    return True
 
# Function to validate a list of files
def validate_files(files):
    if not files or len(files) == 0:
        return False
    if len(files) > MAX_FILES:
        return False
 
    # Verify every file
    for f in files:
        if not validate_file(f):
            return False
 
    return True
 
def validate_voluntario(name, lastname, email, phone_code, phone, region, comuna, address):
 
    nameValid      = validate_field(name, TEXT_RE, 2, 32)
    lastnameValid  = validate_field(lastname, TEXT_RE, 2, 32)
    emailValid     = validate_field(email, EMAIL_RE, 10, 64)
    phoneCodeValid = validate_type(phone_code)
    phoneValid     = validate_field(phone, PHONE_RE, 8, 15)
    regionValid    = validate_type(region)
    comunaValid    = validate_type(comuna)
    addressValid   = validate_field(address, ADDR_RE, 0, 100)
 
    return (nameValid and lastnameValid and emailValid and phoneCodeValid
            and phoneValid and regionValid and comunaValid and addressValid)
 
def validate_avistamiento(bird_type, bird_name, region, comuna, address, date, time, files, description):
 
    birdTypeValid    = validate_type(bird_type)
    birdNameValid    = validate_field(bird_name, TEXT_RE, 3, 50)
    regionValid      = validate_type(region)
    comunaValid      = validate_type(comuna)
    addressValid     = validate_field(address, ADDR_RE, 1, 100)
    dateValid        = validate_date(date, time)
    fileValid        = validate_files(files)
    descriptionValid = validate_field(description, ADDR_RE, 0, 1000)
 
    return (birdTypeValid and birdNameValid and regionValid and comunaValid
            and addressValid and dateValid and fileValid and descriptionValid)