
    function LittleEndianUTF16(input) {
        var output = ''; for (var i = 0; i
            < input.length; i++) {
                output += String.fromCharCode(input.charCodeAt(i)
                    & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
        } return output;
    }

    function EncodeBase64(text){
        var oXML = new ActiveXObject("MSXML2.DOMDocument");
        oNode = oXML.createElement("b64");
        oNode.dataType = "bin.base64";
        oNode.nodeTypedValue = Stream_StringToBinary(LittleEndianUTF16(text));
        return oNode.text.replace("\n","");
    }

    function Powershell(text){
        var wshShell = new ActiveXObject("WScript.Shell");
        var command = "powershell.exe -NoLogo -NoProfile -WindowStyle Hidden -NonInteractive -EncodedCommand "
        command += EncodeBase64(text) + "\n";
        WriteLog(logFilePath, text)
        WriteLog(logFilePath, command)
        var oExec = wshShell.Exec(command);
        while (oExec.Status == 0){
            var idTimer = window.setTimeout("clearTimer",500, "JScript");
            window.clearTimeout(idTimer);
        }
        oExec.StdIn.Close();
        return oExec.StdOut.ReadAll() + oExec.StdErr.ReadAll();
    }

    function clearTimer(){

    }

    function ConvertFileToANSI(inPath, outPath){
        var command = "Set-Content '" + outPath + "' -Encoding UTF8 -Value (Get-Content '" + inPath + "');";
        return Powershell(command);
    }
