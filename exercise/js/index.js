mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94LXVzZXItbWFwYm94IiwiYSI6ImNrczM4N3MzYTJiZzcybnFqbXJ6YnNzc2UifQ.5PekNu8iY2uj-fAF73t6wg';
let markers=[]
var map = new mapboxgl.Map({
 container: 'map',
 style: 'mapbox://styles/mapbox/streets-v11',
 center:[-118.358080,34.063380],
 zoom:12
})
getData=()=>{
  const zipCode=document.getElementById("zip").value;
  if(zipCode=="")
  return;
  const URL=`http://localhost:3000/api/stores?zip_code=${zipCode}`
  console.log(URL)
  fetch(URL).then((res)=>{
    if(res.status==200)
    return res.json();
  }).then((data)=>{
    if(data.length>0)
    {clearLocation();
    addMarker(data);
    populateStoreList(data);
    addClickListener(data)
    }
    else
    {
      clearLocation();
      noStoreFound();
    }
  }).catch((err)=>{
    console.log(err);
  })
}
clearLocation=()=>
{  let i=0;
   while(markers.length)
   {
       markers[i].remove();
       markers.shift();
   }
   console.log(markers.length);
   console.log(markers);
}
populateStoreList=(stores)=>{
  let storeContainerData="";
  stores.forEach((data)=>
  {
      storeContainerData+=`<div class="indi-store">
      <div class="store-container-background">
      <div class="store-info-container">
          <div class="store-address">
           <span>${data.address.streetAddressLine1}</span>
           <span>${data.address.city}</span>
          </div>
          <div class="store-phone-number">
             ${data.phoneNumber}
          </div>
      </div>
      </div>
  </div>`
  })
  document.querySelector(".group-store").innerHTML=storeContainerData;
}
addClickListener=(data)=>
{
  const list_item=document.querySelectorAll('.indi-store');
  console.log(list_item);
  list_item.forEach((item,index)=>{
    item.addEventListener("click",()=>{
      console.log(data[index].location.coordinates[0]);
      const popup = new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat([data[index].location.coordinates[0], data[index].location.coordinates[1]])
      .setHTML(`<div class="store-info-window">
      <div class="store-info-name">
      ${data[index].storeName}
      </div>
      <div class="store-info-open-status">
      ${data[index].openStatusText}
      </div>
      <div class="store-info-address">
      <div class="icon">
      <i class="fas fa-location-arrow"></i>
      </div>
      <span>
      ${data[index].address.streetAddressLine1}
      </span>
      </div>
      <div class="store-info-phone">
      <div class="icon">
      <i class="fas fa-phone"></i>
      </div>
      <span>
      <a href="tel:${data[index].phoneNumber}">${data[index].phoneNumber}</a>
      </span>
      </div>
      </div>
      `)
      .addTo(map);
    })
  })
}
noStoreFound=()=>{
  const html=`
      <div class="no-store-found">
         No stores found
      </div>
  `
  document.querySelector('.group-store').innerHTML=html;
}
addMarker=(data)=>{
  data.forEach((point)=>{
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<div class="store-info-window">
      <div class="store-info-name">
      ${point.storeName}
      </div>
      <div class="store-info-open-status">
      ${point.openStatusText}
      </div>
      <div class="store-info-address">
      <div class="icon">
      <i class="fas fa-location-arrow"></i>
      </div>
      <span>
      ${point.address.streetAddressLine1}
      </span>
      </div>
      <div class="store-info-phone">
      <div class="icon">
      <i class="fas fa-phone"></i>
      </div>
      <span>
      <a href="tel:${point.phoneNumber}">${point.phoneNumber}</a>
      </span>
      </div>
      </div>
      `
      );
    const marker = new mapboxgl.Marker({
      color:"red"
 })
 .setLngLat([point.location.coordinates[0],point.location.coordinates[1]])
 .setPopup(popup).addTo(map);

  //console.log(marker);
  markers.push(marker);
  }
  )
  console.log(markers);

}