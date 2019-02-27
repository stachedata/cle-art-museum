const loader = document.getElementById('loader') //loader displays while images load
let json //to hold json data in global scope

//Buttons
document.getElementById('infoBtn').onclick = () => document.getElementById('infoModal').showModal() //Open info modal
document.getElementById('closeBtn').onclick = () => document.getElementById('infoModal').close()    //Close info modal
document.getElementById('title').onclick = () => window.scrollTo(0,0) //scroll to top of page
document.getElementById('randomizeBtn').onclick = () => {
    loader.style.display = 'block'
    parseJson(json,true) //randomize art
    window.scrollTo(0,0) //scroll to top of page
}                      

//fetchs and returns json from api
const url = 'https://cors-anywhere.herokuapp.com/https://openaccess-api.clevelandart.org/api/artworks/?q=dog&has_image=1&limit=250'
fetch( url , {mode: 'cors', headers: {'Access-Control-Allow-Origin': 'https://openaccess-api.clevelandart.org'}})
.then(resp => resp.json())
.then(respJson => {
    json = respJson
    parseJson(json,false)
})
.catch(error => window.alert('Error: ' + error.message))
   
//parse json to an object and send to display art
const parseJson = (json, randomize) => { 
    let array = json.data
    if (randomize == true) array = randomizeArt(array) //randomize data if triggered by randomize button

    for(let i=0;i<12;i++){
    let data = array.shift()
            data = {
                image: data.images.web.url,
                title: data.title,
                culture: data.culture[0],
                description: data.wall_description ? data.wall_description : '' //replace null description with empty string
            }
            displayArt(data.image,data.title,data.culture,data.description)
        }
    }
 


const displayArt = (image,title,culture,description) => {
    const container = document.getElementById('container')
    const artDiv = document.createElement('div')
    const labelOverlay = document.createElement('div')
    artDiv.className = "artDiv"
    labelOverlay.className = "labelOverlay"
    artDiv.innerHTML = '<img class=artImage src="./images/placeholder.jpeg" data-src="' + image + '" alt="' + title + '"/>'
    labelOverlay.innerHTML = '<div class=artInfo>' + title + '<br>' + culture + '<br><br>' + description
    container.appendChild(artDiv).appendChild(labelOverlay)
    loader.style.display = 'none'
    return container
}

const removeArt = () => {
    let container = document.getElementById('container')
    while (container.firstChild) container.removeChild(container.firstChild)
}

const randomizeArt = (a) => {
    removeArt() //first, remove previous art on page
    //Fisher-Yates shuffle algorithm 
    let j, x, i
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1))
        x = a[i]
        a[i] = a[j]
        a[j] = x
    }
    return a
}

//Lazy Loading Goes Here
function loadImage(image) {
    image.src = image.dataset.src
    console.log(image.dataset.src)
    // setTimeout(() => {
    // }, 1000)
  }


const options = {
    root: document.querySelector('container'),
    rootMargin: '0px',
    threshold: 0
}

let callback = function(entries, sel) { 
    // entries.forEach(entry => {
    //     console.log('entry: ', entry)
    //     if (entry.intersectionRatio > 0) {
    //       //entry.target.classList.add('active');
    //       console.log(entry.target)
    //       loadImage(entry.target)
    //       sel.unobserve(entry.target)
    //     }
    // })

    for(let entry of entries){
        console.log('entry: ', entry)
        if (entry.intersectionRatio > 0) {
          //entry.target.classList.add('active');
          console.log(entry.target)
          loadImage(entry.target)
          sel.unobserve(entry.target)
        }
    }
}
let observer = new IntersectionObserver(callback,options)


//const images = document.querySelectorAll('img[data-src]')
const images = document.getElementsByClassName('artImage')
console.log("images:",images)
Array.from(images).forEach(img => {
        console.log("test",img.alt)
    observer.observe(img)
})

// for(let img of images){
//     observer.observe(img)
// }
  


