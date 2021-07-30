import sketch from 'sketch'

function openUrl(url) {
  
}

export function doFeedback() {
  NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString('https://github.com/rijieli/duplicate-symbol-locator-plugin/issues'))
}

export default function() {
  const doc = sketch.getSelectedDocument()

  let symbols = doc.getSymbols()

  let symbolNameSet = {}

  let duplicateItem = new Array()

  let duplicateItemName = new Array()

  symbols.forEach(e=> {

    if(duplicateItemName.includes(e.name)) {
      duplicateItem.push(e)
      return
    }

    if(symbolNameSet.hasOwnProperty(e.name)) {
      duplicateItem.push(symbolNameSet[e.name])
      duplicateItem.push(e)
      duplicateItemName.push(e.name)
    } else {symbolNameSet[e.name] = e}
  })


  if(duplicateItem.length == 0) {
    sketch.UI.alert("No duplicate Symbol found", "Your document is clean.")
  } else {

    let count = 0
    let currentName = duplicateItem[0].name

    let menuItem = duplicateItem.map(e=>{
      if(e.name == currentName) {
        count += 1
        return count + ". " + e.name
      }

      count = 1
      currentName = e.name

      return count + ". " + e.name
    })

    sketch.UI.getInputFromUser(
      "Found " + duplicateItem.length + " duplicate symbols\n\nSelect one then press OK",
      {
        type: sketch.UI.INPUT_TYPE.selection,
        possibleValues: menuItem,
      },
      (err, value) => {
        if (err) {
          // most likely the user canceled the input
          return
        }
        let order = parseInt(value.split(". ")[0]) - 1

        let selectedSymbol = duplicateItem[order]
        let parentPage = selectedSymbol.getParentPage()

        doc.selectedPage = parentPage
        doc.centerOnLayer(selectedSymbol)
        doc.selectedLayers.clear()
        selectedSymbol.selected = true

        let symbolName = selectedSymbol.name.split("/").pop()

        sketch.UI.message("💎 " + symbolName + " selected, press ⌘ + 2 to zoom.")
      }
    )
  }
}