//�O���[�o���ϐ���ݒ�
var fso = new ActiveXObject("Scripting.FileSystemObject");
var oBaseFolder = getBaseFolder();
var pageNameStack = new Array();

//����HTML�t�@�C�����u����Ă���t�H���_�̃p�X�����擾����
function getBaseFolder(){
    return fso.GetFolder(".");
}


//�G�N�X�v���[���Ńt�H���_�E�t�@�C�����J��
function OpenFolder(Path){
 //   alert(Path);
   var ss = Path.split(',');
   //  Shell�֘A�̑����񋟂���I�u�W�F�N�g����2���擾
   var sh = new ActiveXObject( "Shell.Application" );
   var Path2 = "";

//     alert(ss.length);

   for(var i=0; i < ss.length; i++){
      if(!(ss[i] == "")){
        Path2 += ss[i] + '\\';
      };
   }
//  alert(Path2);

   //�G�N�X�v���[���ŊJ��
   sh.Open(Path2);
   //  �I�u�W�F�N�g�����
   sh = null;
}

//�y�[�W�����w�肵�ăy�[�W���J��
function open(pagename){
    var content = getContent(pagename);
    if(! content){
        return edit(pagename);
    }


//    var renderer = new marked.Renderer();
//    renderer.link = function(href, title, text) {
//     renderer.link = function (text, level) {
//    alert("text=" +  text + "level" + level );
//      alert(href  + "  " +  title + "  " + text );
//    };
//    renderer.heading = function (text, level) {
//	alert("text=" +  text + "level" + level );
//
//    var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
//      return '<h' + level + '><a name="' +
//                escapedText +
//                 '" class="anchor" href="#' +
//                 escapedText +
//                 '"><span class="header-link"></span></a>' +
//                  text + '</h' + level + '>';
//    };


//    alert(marked('# heading+', { renderer: renderer }));
//    var html = marked(content, { renderer: renderer });


    //������marked.js���g�p�i�ꕔ�����j
    var html = marked(content);




    //�t�@�C�����A�X�V��������t�^
    id('FileName').innerText = getFilePathAndName(pagename);
    id('DateCreated').innerText = "�쐬����:" + getDateCreated(pagename);
    id('DateLastModified').innerText = "�X�V����:" + getDateLastModified(pagename);

    //�\������
    setHistory(pagename);
    getHistory();
    
    setPageName(pagename);
    setContent(html);
    showEditLink();
}

//����ۑ�
function setHistory(pagename) {

    //�X�^�b�N�ɗ�����ۑ�
    if (0 == pageNameStack.length) {
        //����͖������ŕۑ�
        pageNameStack.push(pagename);
    } else {
        //�ۑ�����Ă��闚���O�̂ݕۑ�
        var matched = false;
        for (var i = 0; i < pageNameStack.length; i++) {
            var tmp = pageNameStack[i];
            if (tmp == pagename) {
                matched = true;
            }
        }
        if (matched == false) {
            pageNameStack.push(pagename);
        }
    }
}

function getHistory() {
    //�X�^�b�N���̗�����\��
    var html = "�\�������F"
    for (var i = 0; i < pageNameStack.length; i++) {
        var tmp = pageNameStack[i];
        html = html + "<a href='javascript:open(\"" + tmp + "\")'>" + tmp + "</a> ";
    }
    html = html + " ";
    id('history').innerHTML = html;
}

//�}�[�N�_�E���imd)�t�@�C�������t���p�X�Ŏ擾
function getFilePathAndName(pagename){
    var s = '';
    var filepath = getFilePath(pagename);
    var f = fso.GetFile(filepath);
    s = f.Path ;
    return(s);
}

//�t�@�C���̍쐬�������擾����
function getDateCreated(pagename){
   var s = '';
   var filepath = getFilePath(pagename);
   var f = fso.GetFile(filepath);
   var CreateDate = new Date(f.DateCreated);
   s += CreateDate.toLocaleDateString() + " " + CreateDate.toLocaleTimeString();  
   return(s);

}
//�t�@�C���̍X�V�������擾����
function getDateLastModified(pagename) {
    var s = '';
    var filepath = getFilePath(pagename);
    var f = fso.GetFile(filepath);
    var ModDate = new Date(f.DateLastModified);
    s += ModDate.toLocaleDateString() + " " + ModDate.toLocaleTimeString();
    return (s);
}

//�y�[�W�����w�肵�ăy�[�W��ҏW����
function edit(pagename){
    var content = getContent(pagename);

//    var html =
//           "<form  onsubmit='save(\"" + pagename + "\"); return false;'>"
//         + "<textarea cols='120' rows='30' id='textarea' wrap='off'>" + content + "</textarea><br />"
//         + "<input type='submit' value='�ۑ�'><br />"
//         + "</form>";
//�ҏW���@�̏C�� textarea�ւ̊i�[�̓t�H�[���������textarea�փe�L�X�g����
    var html =
           "<form  onsubmit='save(\"" + pagename + "\"); return false;'>"
         + "<textarea cols='120' rows='30' id='textarea' wrap='off'>" + "</textarea><br />"
         + "<input type='submit' value='�ۑ�'><br />"
         + "</form>";


    setPageName(pagename);
    setContent(html);
    id('textarea').innerText = content;
    hideEditLink();
}

//���܌��Ă���y�[�W��ҏW����
function editCurrentPage(){
    pagename = id('headerH1').innerText;
    edit(pagename);
}

//�t�H�[���̃e�L�X�g�G���A�̒��g���A�w�肵���y�[�W�̃R���e���c�Ƃ��ĕۑ�����
function save(pagename){

//�ҏW���@�̏C�� textarea�ւ̊i�[�̓t�H�[���������textarea�փe�L�X�g����
//    var content = id('textarea').value;
    var content = id('textarea').innerText;

    var filepath = getFilePath(pagename);
    var file = fso.createTextFile(filepath);
    file.write(content);
    file.Close();
    open(pagename);

}

//�y�[�W�ꗗ��ʂ�\������
function openIndexPage(){

    var openIndexPageName = '�y�y�[�W�ꗗ�z';
    var enuFiles = new Enumerator(oBaseFolder.Files);
    
    var myFiles = [];
    for (; !enuFiles.atEnd(); enuFiles.moveNext() ){ 
            var FilePath = enuFiles.item(); 
            var ExtensionName = fso.GetExtensionName(FilePath); // �g���q���擾
            var BaseName = fso.GetBaseName(FilePath); // �x�[�X�l�[�����擾
            if(ExtensionName == "md"){ // �g���q��md��������
                myFiles.push(BaseName);
            }
    }
    
    var list = [];
    list.push('|�t�@�C����|�쐬��|�X�V��|');
    list.push('|:-|:-:|:-:|');
    //�t�@�C���ۑ��p�A�\���p�̃t�H�[�}�b�g�ϊ�
    for(var i = 0; i < myFiles.length; i++){
//        list.push('<li><a href="javascript:open(\'' + myFiles[i] + '\');">' + myFiles[i] + '</a></li>');
//        list.push('<li>[' + myFiles[i] + '](' + myFiles[i] + ')</li>' );
        list.push('|[' + myFiles[i] + '](' + myFiles[i] + ')|' + getDateCreated(myFiles[i]) +'|' + getDateLastModified(myFiles[i]) +'|' );
    }

    var content = list.join("\r\n");

    //�t�@�C���ۑ�
    var filepath = getFilePath( openIndexPageName );
    var file = fso.createTextFile(filepath);
    file.write(content);
    file.Close();


    //������marked.js���g�p�i�ꕔ�����j
    var html = marked(content);

    //�\������
    setHistory( openIndexPageName );
    getHistory();

    //�\��
    setPageName( openIndexPageName );
    setContent( html );
    showEditLink();

}

//�y�[�W�����w�肵�āA�Y������}�[�N�_�E���i.md)�̃p�X�����擾����
function getFilePath(pagename){
    var filename = pagename + ".md";
    return oBaseFolder.Path + "\\" +  filename;
}

//�y�[�W�����w�肵�āA�Y������}�[�N�_�E���t�@�C���̒��g���擾����
function getContent(pagename){
    var content = '';
    var filepath = getFilePath(pagename);

    if(fso.fileExists(filepath)){
        var file = fso.openTextFile(filepath);
        if(! file.atEndOfStream){
            content = file.readAll();
        }
        file.Close();
    }
    return content;
}

//���j���[�́u�ҏW�v�����N��\������
function showEditLink() {
    id('editLink').style.display = "inline";
}

//���j���[�́u�ҏW�v�����N���\���ɂ���
function hideEditLink() {
    id('editLink').style.display = "none";
}

//�R���e���c����ʂɕ\������
function setContent(html) {
    id('content').innerHTML = html;
}

//�y�[�W������ʂɕ\������
function setPageName(pagename) {
    if(pagename){
        id('headerH1').innerText = pagename;
    }
}

//��ʂ̃y�[�W�����擾����
function getPageName() {
    return id('headerH1').innerText;
        
}
//HTML�̗v�f���擾����
function id(s) {
    return document.getElementById(s);
}

//�����Ƀq�b�g�����y�[�W�̈ꗗ��ʂ�\������
function FindIndexPage() {
    var enuFiles = new Enumerator(oBaseFolder.Files);
    var myFiles = [];
    var FindIndexPageName = '�y�������ʁz';

    for (; !enuFiles.atEnd(); enuFiles.moveNext()) {
        var FilePath = enuFiles.item();
        var ExtensionName = fso.GetExtensionName(FilePath); // �g���q���擾
        var BaseName = fso.GetBaseName(FilePath); // �x�[�X�l�[�����擾

        if (ExtensionName == "md") { // �g���q��md��������
            //�t�@�C��������
            var database = FilePath;
            var sword = Text1.value;
            var check = BaseName.indexOf(sword, 0);
            if (0 <= check) {
                //�t�@�C�������i�[
                myFiles.push(BaseName);
            }
            else {
                //�t�@�C���̒��g������
                if (0 <= openAndSerch(BaseName) )
                {
                    //�t�@�C�������i�[
                    myFiles.push(BaseName);
                }
            }
        }
    }
    
    var list = [];
    list.push('|�t�@�C����|�쐬��|�X�V��|');
    list.push('|:-|:-:|:-:|');
    for (var i = 0; i < myFiles.length; i++) {
//        list.push('<li><a href="javascript:open(\'' + myFiles[i] + '\');">' + myFiles[i] + '</a></li>');
//        list.push('<li>[' + myFiles[i] + '](' + myFiles[i] + ')</li>' );

        list.push('|[' + myFiles[i] + '](' + myFiles[i] + ')|' + getDateCreated(myFiles[i]) +'|' + getDateLastModified(myFiles[i]) +'|' );

    }
    var content = list.join("\r\n");
    //�t�@�C���ۑ�
    var filepath = getFilePath(�@FindIndexPageName  + Text1.value�@);
    var file = fso.createTextFile(filepath);
    file.write(content);
    file.Close();

    //������marked.js���g�p�i�ꕔ�����j
    var html = marked(content);

    //�\���������i�[�A�\��
    setHistory( FindIndexPageName  + Text1.value );
    getHistory();
    
    //�\��
    setPageName( FindIndexPageName  + Text1.value );
    setContent( html );
    showEditLink();

}

//�y�[�W�����w�肵�ăy�[�W���J���A�����������q�b�g�������`�F�b�N����
function openAndSerch(pagename) {
    var content = getContent(pagename);
    if (!content) {
        return edit(pagename);
    }
    //�t�@�C��������
    var database = content;
    var sword = Text1.value;
    var check = database.indexOf(sword, 0);
    return check
}

//�V�K�쐬
function NewPage() {
    var pagename = Text2.value;
//    window.confirm(pagename);
    if (pagename) {
        open(pagename);
    }
    Text2.value = '';
}
//���l�[��
function ReNamePage() {

    var srcPagename = getPageName();
    var dstPagename = Text2.value;

    // �uOK�v���̏����J�n �{ �m�F�_�C�A���O�̕\��
    if (window.confirm(dstPagename + ' �Ƀ��l�[�����܂����H'))
    {

        var srcFilepath = getFilePath(srcPagename);
        var dstFilepath = getFilePath(dstPagename);
    
        fso.MoveFile(srcFilepath, dstFilepath);
        window.alert(srcPagename + ' �� ' + dstPagename + ' �Ƀ��l�[�����܂����B');         
        open(dstPagename);
    }
    else {
        window.alert('�L�����Z������܂����B'); // �x���_�C�A���O��\��
    }
    Text2.value = '';
}

//�폜
function DeletePage() {

    var pagename = getPageName();

    // �uOK�v���̏����J�n �{ �m�F�_�C�A���O�̕\��
    if (window.confirm(pagename + ' ���폜���܂����H')) {

        var pagename = getPageName();
        var filepath = getFilePath(pagename);

        fso.DeleteFile(filepath);
        window.alert(pagename + ' ���폜���܂����B'); 
        open('�g�b�v�y�[�W');
    }
    else {
        window.alert('�L�����Z������܂����B'); // �x���_�C�A���O��\��
    }
    Text2.value = '';
}
