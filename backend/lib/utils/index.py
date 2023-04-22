import os
import asyncio
import functools

def make_dir_if_not_exist(dirpath: str):
    if not os.path.exists(dirpath):
        os.makedirs(dirpath)
        print(f"'{dirpath}' directory has been created")
    else:
        print(f"'{dirpath}' directory already exists")

def divide_chunks(l, n):
    # looping till length l
    for i in range(0, len(l), n):
        yield l[i:i + n]

def async_wrapper(func):
    @functools.wraps(func)
    async def async_func(*args, **kwargs):
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, func, *args, **kwargs)
        return "[ASYNC_WRAPPER] async func completed"

    return async_func

def unlinkFile(filename: str) -> None:
    try:
        if os.path.isfile(filename):
            print("File removed - ", filename)
            os.remove(filename)
        else:
            print("File does not exist - ", filename)
        return True
    except Exception as e:
        print(e)
        return "Unable to remove file"

def check_filepath(filepath: str) -> bool:
    if os.path.isfile(filepath):
        return True
    return False
