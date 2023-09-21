const videosContainer = document.getElementById('videosContainer')
const catFilter = document.getElementById('catFilter')
const videoIdInput = document.getElementById('videoId')
const videoCatInput = document.getElementById('videoCat')
const popup = document.getElementById('popup')
const videoEl = document.querySelector('#popup>iframe')

let savedVideos = []
let filterOptions = []
let filterCat = null
const IDS_KEY = "savedVideos"
const OPTIONS_KEY = "filterOptions"
// localStorage.setItem(
//   'savedVideos',
//   JSON.stringify(['9C74_rOgui8', 'msGOrJIMGy8'])
// )


//M --> Creating and loading data section
const loadVideos = () => {
  savedVideos = JSON.parse(localStorage.getItem(IDS_KEY)) || []
}

const loadFilterOptions = () => {
  filterOptions = JSON.parse(localStorage.getItem(OPTIONS_KEY)) || []
}

const updateStorage = () => {
  localStorage.setItem(IDS_KEY, JSON.stringify(savedVideos))
  localStorage.setItem(OPTIONS_KEY, JSON.stringify(filterOptions))
}


//V --> Display section
const displayVideos = (filterCat) => {
  // https://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
  const videosStr = filterCat === null 
  ? savedVideos.map(({id, cat}) => `
      <li onclick="clickVideo(event, '${id}', '${cat}')">
        <img class="thumbnail" src="https://i3.ytimg.com/vi/${id}/sddefault.jpg" alt="Cover image for Youtube video with id ${id}">
      
        <button class="delete-btn">&times;</button>   
      </li>`
    ).join('')

  : savedVideos
    .filter(vid => vid.cat.toLowerCase() === filterCat)
    .map(({id, cat}) => `
      <li onclick="clickVideo(event, '${id}')">
        <img class="thumbnail" src="https://i3.ytimg.com/vi/${id}/sddefault.jpg" alt="Cover image for Youtube video with id ${id}">
      
        <button class="delete-btn">&times;</button>   
      </li>`
    ).join('')

  videosContainer.innerHTML = videosStr
}

const displayOptions = () => {
  // https://flexiple.com/javascript/javascript-capitalize-first-letter
  const optionStr = filterOptions.map(op => (`
    <option value="${op.toLowerCase()}">
      ${op.charAt(0).toUpperCase() + op.slice(1)}
    </option>
  `)).join('')

  if(filterOptions.length > 0) {
    catFilter.parentElement.style.display = 'block'
    if(filterCat === null) catFilter.innerHTML = "<option hidden>All</option>" + optionStr
  }
  else {
    // https://www.w3schools.com/jsref/prop_node_parentelement.asp
    catFilter.parentElement.style.display = 'none'
  }
}



// C --> Control: Modify data and display
const setFilter = (e) => {
  filterCat = e.target.value
  displayVideos(filterCat)
}

const cancelFilter = () => {
  filterCat = null
  catFilter.value = 'All'
  displayVideos(filterCat)
}

const clickVideo = (event, id) => {
  if(event.target.classList.contains('delete-btn')){
    // Remove video
    savedVideos = savedVideos.filter(vid => vid.id !== id)

    // Verify remaining category in video list
    const savedVideosCat = savedVideos.map(vid => vid.cat.toLowerCase())
    filterOptions = filterOptions.filter(op => savedVideosCat.includes(op))

    updateStorage()
    displayVideos(filterCat)
    displayOptions()
  } else {
    videoEl.src = `https://www.youtube.com/embed/${id}`
    popup.classList.add('open')
    popup.classList.remove('closed')
  }
}

const handlePopupClick = () => {
  popup.classList.add('closed')
  popup.classList.remove('open')
}

const pushOptions = (option) => {
  filterOptions = filterOptions.map(o => o.toLowerCase())
  if(!filterOptions.includes(option.toLowerCase())){
    filterOptions.push(option.trim().toLowerCase())
  }
}

const saveVideo = (e) => {
  e.preventDefault()
  const videoId = videoIdInput.value
  const videoCat = videoCatInput.value
  
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
  // Insert new video to the beginning of array
  savedVideos.unshift({id: videoId, cat: videoCat})
  // Insert New option to select box
  pushOptions(videoCat)

  videoIdInput.value = ""
  videoCatInput.value = ""

  console.log(savedVideos, filterOptions)
  
  updateStorage()
  displayVideos(filterCat)
  displayOptions()
}

loadVideos()
loadFilterOptions()
displayVideos(filterCat)
displayOptions()

