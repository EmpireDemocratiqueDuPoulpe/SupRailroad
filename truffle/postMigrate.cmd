@REM /K - Copies attributes. Normal xcopy resets read-only attributes.
@REM /E - Copies directories and subdirectories, including empty one.
@REM /H - Copies hidden and system files also.
@REM /D - Copies files changed on or after the specified date. If no date is given, copies only those files whose source time is newer than the destination time.
@REM /Y - Suppresses prompting to confirm you want to overwrite an existing destination file.
xcopy "..\client\src\contracts\*.*" "..\oracle\contracts\" /K /E /H /D /Y
