
window.addEventListener('load', function () {

document.querySelector("#export").addEventListener("click", async() => {

	const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
	const tab = tabs[0]; 

	const fromPageLocalStore = await chrome.scripting.executeScript({ target: { tabId: tab.id }, function: () => JSON.stringify(localStorage) });
		
	const blob = new Blob([fromPageLocalStore[0].result]);
	const url = URL.createObjectURL(blob);
	chrome.downloads.download({
	  url: url,
	  filename: 'storage.json'
	});
});

document.querySelector("#import").addEventListener("click", async() => {

	const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
	const tab = tabs[0]; 
	let file = document.querySelector("#myfile").files[0];
	if (file) {
		let reader = new FileReader();
		reader.readAsText(file, "UTF-8");
		reader.onload = async (evt) => {
			try{
				let content = evt.target.result;
				
				await chrome.scripting.executeScript({ target: { tabId: tab.id }, args: [content], function: setStorage
				});
			}
			catch(e) { 
			  alert("Caught: " + e.message)
			}
		}
	}
        
});

function setStorage(jsonString){
	let obj = JSON.parse(jsonString);
	
	for (let x in obj)
		localStorage.setItem(x, obj[x]);
}


});