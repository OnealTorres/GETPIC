
const card = document.querySelector('.card');
const fileHolder = document.getElementById('search-bar');
const input = document.querySelector('input[type="file"]');
const button = document.querySelector('button');
const textarea = document.querySelector('#input-url');
const indicators = document.querySelector('.carousel-indicators')
const slide = document.querySelector('.carousel-inner')
const switchBtn1 = document.querySelector('#flexSwitchCheckChecked')
const switchBtn2 = document.querySelector('#flexSwitchCheckDefault')

var globalFile;
var imgURL=[]
input.addEventListener('change',()=> {
  const files = (input.files)[0];
  linkExtract(files)  
});
textarea.addEventListener('change',()=> {
  imgURL = []
  var txt = document.getElementById("input-url").value
  txt = new Blob([txt],{ type: "text/plain;charset=utf-8" });
  linkExtract(txt);
});

function clearFields(){
  fileHolder.value ="";
  document.getElementById("input-url").value = ""
}
function linkExtract(files){
  const file = files
  try{
    if (files.length == 0) return;
  }
  catch(e){
    console.log(e)
  }
    
    let reader = new FileReader();
    reader.onload = (e) =>{
      const file = e.target.result;
      const lines = file.split('\n');
      let lineIndex = 0;
      let tail = "";
      let prev_URL ="";
      let tailFound = false;
      while (lineIndex < lines.length-1){
        try{
          if (lines[lineIndex].search("http") != -1){
            let testLine = lines[lineIndex]
            testLine = testLine.split(" ");
            for(let i =0;i<testLine.length; i++){
              if(testLine[i].search("data-src") != -1 || testLine[i].search("data-srcset") != -1){
                
                var charIndex = testLine[i].search("http");
                var link ="";
                var reduce = 0;
               
                if (testLine[i].charAt(testLine[i].length-1)=='"'){
                  reduce =1
                }
                for(let b =charIndex; b<testLine[i].length-reduce;b++){
                  link += testLine[i].charAt(b);
                }
                // if (link.search("mitaku")!=-1){
                //   if (imgURL.length == 0 && tail == ""){
                //     tail = link
                //   }
                //   else if(tailFound){
                //     break;
                //   }
                //   else{
                //     if (tail != link){
                //       imgURL.push(link)
                //     }
                //     else if (tail == link){
                //       imgURL.push(link)
                //       tailFound =true;
                //     }
                //   }
                // }
                // else{
                  if(prev_URL != link && link.search("gif")==-1 && link.search("Cover") == -1)
                    imgURL.push(link)
                    prev_URL = link
                //  }
                }
              }
            }
          }
        catch(e){
          console.log(e);
        }
        lineIndex++;
      }
      imgURL = [...new Set(imgURL)];
    }
    reader.onerror = (e) => alert(e.target.error.name);
    reader.readAsText(file)
    
}

function clearGallery(){
  if (document.getElementById("img-organizer").innerHTML != ''){
    document.getElementById("img-organizer").innerHTML = '';
  }
  indicators.innerHTML =""
  slide.innerHTML = ""
  imgURL = []
}
function retrieveURL(){
  if (input.files.length ==0 && textarea.value == "" && imgURL.length== 0){
    console.log("Fields are empty")
  }
  else{
    if (switchBtn1.checked){
      galleryImgViewer();
    }
    if(switchBtn2.checked){
      carouselImgViewer();
    }
  }
}
function galleryImgViewer() {
  clearFields()
  var gallery = document.getElementById('img-organizer');
  var divCount = 1;
  for(let i=0; i!=imgURL.length;i++ ){
    const newDiv = document.createElement('div');
    newDiv.className = "col-4 mx-auto";
    newDiv.style.width = "18rem";
  
    const colCard =
    '<div class="card" style="width: 18rem; height:500px; padding: 5px; margin-top:10px; margin-bottom: 10px">'+
      '<img id="img-card" src="'+imgURL[divCount-1]+'" class="card-img-top" style="object-fit: cover !important;height: 100%;" alt="..."/>'+
      '<div class="card-body">'+
      '<p class="card-text d-flex justify-content-center">Image'+divCount+'</p>'+
    '</div>'+
    '</div>';
    
    newDiv.innerHTML = colCard
    gallery.appendChild(newDiv)
    divCount +=1;
  }
 
}
function carouselImgViewer(){
  //Indicators
  if (indicators.innerHTML == "" && imgURL.length != 0){
    const parser = new DOMParser();
    let imgCaro= '<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>'
    // convert html string into DOM
    imgCaro = parser.parseFromString(imgCaro, "text/html");
    indicators.appendChild(imgCaro.body.children[0]);
  }
  for( let i =2; i<=imgURL.length; i++){
    const parser = new DOMParser();
    let imgCaro  = '<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="'+(i-1)+'" aria-label="Slide '+(i)+'"></button>';
    // convert html string into DOM
    imgCaro = parser.parseFromString(imgCaro, "text/html");
    indicators.appendChild(imgCaro.body.children[0]);
  }
  //Slides
  if (slide.innerHTML == "" && imgURL.length != 0){
    const parser = new DOMParser();
    let imgCaro= '<div class="carousel-item active"><img src="'+imgURL[0]+'" style="height: 600px; object-fit: contain"  class="d-block w-100" alt="..." /> </div>'
    // convert html string into DOM
    imgCaro = parser.parseFromString(imgCaro, "text/html");
    slide.appendChild(imgCaro.body.children[0]);
  }
  for( let i =2; i<=imgURL.length; i++){
    const parser = new DOMParser();
    let imgCaro  = '<div class="carousel-item"> <img src="'+imgURL[i-1]+'" style="height: 600px; object-fit: contain" class="d-block w-100" alt="..." /> </div>'
    // convert html string into DOM
    imgCaro = parser.parseFromString(imgCaro, "text/html");
    slide.appendChild(imgCaro.body.children[0]);
  }
}




