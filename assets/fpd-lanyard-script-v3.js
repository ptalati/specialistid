console.log("fpd-lanyard-script-v3")
const priceTable = {
    'one_color_silk': {
      "3/8''": { 100: 2.42, 200: 1.46, 500: 0.81, 1000: 0.60, 2500: 0.53, 5000: 0.48, 10000: 0.47 },
      "5/8''": { 100: 2.49, 200: 1.54, 500: 0.86, 1000: 0.68, 2500: 0.58, 5000: 0.49, 10000: 0.48 },
      'other': { 'breakaway': 0.20, 'duplicated_two_sided': 0.15, 'different_two_sided': 0.95, 'double_ended': 0.3 },
    },
    'three_color_silk': {
      "3/8''": { 100: 2.65, 200: 1.65, 500: 0.97, 1000: 0.76, 2500: 0.59, 5000: 0.54, 10000: 0.53 },
      "5/8''": { 100: 2.80, 200: 1.84, 500: 1.17, 1000: 0.82, 2500: 0.69, 5000: 0.59, 10000: 0.58 },
      "3/4''": { 100: 2.99, 200: 1.95, 500: 1.22, 1000: 0.85, 2500: 0.74, 5000: 0.64, 10000: 0.63 },
      "1''":   { 100: 3.08, 200: 2.12, 500: 1.30, 1000: 0.93, 2500: 0.81, 5000: 0.75, 10000: 0.74 },
      'other': { 'breakaway': 0.20, 'duplicated_two_sided': 0.15, 'different_two_sided': 0.95, 'double_ended': 0.3, 'extra_color': 0.09 },
    },
    'three_color_silk_rush': {
      "3/8''": { 100: 3.13, 200: 1.96, 500: 1.17, 1000: 0.93, 2500: 0.74, 5000: 0.69, 10000: 0.69 },
      "5/8''": { 100: 3.27, 200: 2.19, 500: 1.44, 1000: 1.00, 2500: 0.85, 5000: 0.73, 10000: 0.73 },
      "3/4''": { 100: 3.54, 200: 2.31, 500: 1.49, 1000: 1.01, 2500: 0.92, 5000: 0.81, 10000: 0.81 },
      "1''":   { 100: 3.67, 200: 2.56, 500: 1.58, 1000: 1.14, 2500: 1.02, 5000: 0.96, 10000: 0.96 },
      'other': { 'breakaway': 0.20, 'duplicated_two_sided': 0.15, 'different_two_sided': 0.95, 'double_ended': 0.3, 'extra_color': 0.12 },
    },
    'full_color': {
      "3/8''": { 100: 3.89, 200: 2.52, 500: 1.84, 1000: 1.53, 2500: 1.02, 5000: 0.90, 10000: 0.83 },
      "5/8''": { 100: 4.03, 200: 2.78, 500: 2.16, 1000: 1.63, 2500: 1.15, 5000: 0.97, 10000: 0.85 },
      "3/4''": { 100: 4.30, 200: 2.87, 500: 2.22, 1000: 1.69, 2500: 1.21, 5000: 1.06, 10000: 0.93 },
      "1''":   { 100: 4.42, 200: 3.12, 500: 2.35, 1000: 1.80, 2500: 1.32, 5000: 1.22, 10000: 1.05 },
      'other': { 'breakaway': 0.20, 'duplicated_two_sided': 0, 'different_two_sided': 0.95, 'double_ended': 0.3 },
    },
    'full_color_rush': {
      "3/8''": { 100: 4.24, 200: 2.80, 500: 2.04, 1000: 1.72, 2500: 1.14, 5000: 1.05, 10000: 1.05 },
      "5/8''": { 100: 4.43, 200: 3.06, 500: 2.40, 1000: 1.83, 2500: 1.31, 5000: 1.13, 10000: 1.13 },
      "3/4''": { 100: 4.73, 200: 3.19, 500: 2.48, 1000: 1.89, 2500: 1.39, 5000: 1.36, 10000: 1.36 },
      "1''":   { 100: 4.86, 200: 3.46, 500: 2.64, 1000: 2.02, 2500: 1.52, 5000: 1.52, 10000: 1.52 },
      'other': { 'breakaway': 0.20, 'duplicated_two_sided': 0, 'different_two_sided': 0.95, 'double_ended': 0.3 },
    },
    'one_color_woven': {
      "1/4''": { 100: 3.84, 200: 3.08, 500: 2.11, 1000: 1.92, 2500: 1.77, 5000: 1.56, 10000: 1.50 },
      "3/8''": { 100: 3.37, 200: 2.19, 500: 1.57, 1000: 1.29, 2500: 1.09, 5000: 1.00, 10000: 0.88 },
      "5/8''": { 100: 3.59, 200: 2.44, 500: 1.89, 1000: 1.36, 2500: 1.21, 5000: 1.07, 10000: 0.92 },
      "3/4''": { 100: 3.78, 200: 2.54, 500: 1.95, 1000: 1.44, 2500: 1.29, 5000: 1.13, 10000: 1.03 },
      "1''":   { 100: 3.92, 200: 2.81, 500: 2.08, 1000: 1.59, 2500: 1.40, 5000: 1.30, 10000: 1.15 },
      'other': { 'breakaway': 0.20, 'extra_color': 0.09 },
    }
  }

  const avTable = {
    'one_color_silk': {
      'imprint':['one_color_silk', 'three_color_silk', 'full_color', 'one_color_woven'],
      'shipping': ['default'],
      'width': ["3/8''", "5/8''"],
      "breakaway": true,
      'twoSided': true,
      "symmetrical": false,
      "endFittings": ["Nickel-Plated Swivel Hook", "Nickel-Plated Swivel Bulldog Clip", "Nickel-Plated Split Ring"],
      "colors": ["White", "Black", "Red 200C", "Navy Blue 289C", "Royal Blue 294C", "Green 348C"]
    },

    'three_color_silk': {
      'imprint':['one_color_silk', 'three_color_silk', 'full_color', 'one_color_woven'],
      'shipping': ['rush', 'default'],
      'width': ["3/8''", "5/8''", "3/4''", "1''"],
      "breakaway": true,
      'twoSided': true,
      "symmetrical": true,
      // "endFittings": ["Nickel-Plated Swivel Hook", "Nickel-Plated Swivel Bulldog Clip", "Nickel-Plated Split Ring", "Nickel-Plated Steel Trigger Snap Hook", "Black Wide Plastic Hook", "White Wide Plastic Hook", "Black Narrow Plastic Hook", "White Narrow Plastic Hook", "Black Oxide Swivel Hook", "Black Oxide Bulldog Clip", "Black Oxide Split Ring", "Nickel-Plated Large Non-Swivel J Hook"],
      "endFittings": 'all',
      "colors": ["White", "Black", "Red 200C", "Navy Blue 289C", "Royal Blue 294C", "Green 348C", "Orange 151C", "Yellow 115C", "Purple 268C", "Teal 316C", "Maroon 195C", "Forest 5535C", "Rubine Red C", "Blue 072C", "Bright Yellow 109C", "Mustard Yellow 116C", "Rich Red 187C", "Bright Red 186C", "Pink 211C", "Dark Blue 282C", "Pale Blue 292C", "Sky Blue 635C", "Blue Green 322C", "Lime Green 375C", "Aqua Blue 801C", "Hot Pink 806C", "Bright Green 802C", "Neon Yellow 809C", "Vivid Purple 814C", "Cool Grey 7", "Burnt Yellow 1235C", "Burnt Orange 1495C"]
    },

    'three_color_silk_rush': {
      'imprint':['full_color', 'three_color_silk'],
      'shipping': ['rush', 'default'],
      'width': ["3/8''", "5/8''", "3/4''", "1''"],
      "breakaway": true,
      'twoSided': true,
      "symmetrical": true,
      // "endFittings": ["Nickel-Plated Swivel Hook", "Nickel-Plated Swivel Bulldog Clip", "Nickel-Plated Split Ring", "Nickel-Plated Steel Trigger Snap Hook", "Black Wide Plastic Hook", "White Wide Plastic Hook", "Black Narrow Plastic Hook", "White Narrow Plastic Hook", "Black Oxide Swivel Hook", "Black Oxide Bulldog Clip", "Black Oxide Split Ring", "Nickel-Plated Large Non-Swivel J Hook"],
      "endFittings": 'all',
      "colors": ["White", "Black", "Red 200C", "Navy Blue 289C", "Royal Blue 294C", "Green 348C", "Orange 151C", "Yellow 115C", "Purple 268C", "Teal 316C", "Maroon 195C", "Forest 5535C", "Rubine Red C", "Blue 072C", "Bright Yellow 109C", "Mustard Yellow 116C", "Rich Red 187C", "Bright Red 186C", "Pink 211C", "Dark Blue 282C", "Pale Blue 292C", "Sky Blue 635C", "Blue Green 322C", "Lime Green 375C", "Aqua Blue 801C", "Hot Pink 806C", "Bright Green 802C", "Neon Yellow 809C", "Vivid Purple 814C", "Cool Grey 7", "Burnt Yellow 1235C", "Burnt Orange 1495C"]
    },
    
    'full_color': {
      'imprint':['one_color_silk', 'three_color_silk', 'full_color', 'one_color_woven'],
      'shipping': ['rush', 'default'],
      'width': ["3/8''", "5/8''", "3/4''", "1''"],
      "breakaway": true,
      'twoSided': true,
      "symmetrical": true,
      "endFittings": 'all',
      "colors": ["White", "Black", "Red 200C", "Navy Blue 289C", "Royal Blue 294C", "Green 348C", "Orange 151C", "Yellow 115C", "Purple 268C", "Teal 316C", "Maroon 195C", "Forest 5535C", "Rubine Red C", "Blue 072C", "Bright Yellow 109C", "Mustard Yellow 116C", "Rich Red 187C", "Bright Red 186C", "Pink 211C", "Dark Blue 282C", "Pale Blue 292C", "Sky Blue 635C", "Blue Green 322C", "Lime Green 375C", "Aqua Blue 801C", "Hot Pink 806C", "Bright Green 802C", "Neon Yellow 809C", "Vivid Purple 814C", "Cool Grey 7", "Burnt Yellow 1235C", "Burnt Orange 1495C"]
    },

    'full_color_rush': {
      'imprint':['full_color', 'three_color_silk'],
      'shipping': ['rush', 'default'],
      'width': ["3/8''", "5/8''", "3/4''", "1''"],
      "breakaway": true,
      'twoSided': true,
      "symmetrical": true,
      "endFittings": 'all',
      "colors": ["White", "Black", "Red 200C", "Navy Blue 289C", "Royal Blue 294C", "Green 348C", "Orange 151C", "Yellow 115C", "Purple 268C", "Teal 316C", "Maroon 195C", "Forest 5535C", "Rubine Red C", "Blue 072C", "Bright Yellow 109C", "Mustard Yellow 116C", "Rich Red 187C", "Bright Red 186C", "Pink 211C", "Dark Blue 282C", "Pale Blue 292C", "Sky Blue 635C", "Blue Green 322C", "Lime Green 375C", "Aqua Blue 801C", "Hot Pink 806C", "Bright Green 802C", "Neon Yellow 809C", "Vivid Purple 814C", "Cool Grey 7", "Burnt Yellow 1235C", "Burnt Orange 1495C"]
    },
    
    'one_color_woven': {
      'imprint':['one_color_silk', 'three_color_silk', 'full_color', 'one_color_woven'],
      'shipping': ['default'],
      'width': ["3/8''", "5/8''", "3/4''", "1''"],
      "breakaway": true,
      'twoSided': false,
      "symmetrical": true,
      "endFittings": 'all',
      "colors": ["White", "Black", "Red 200C", "Navy Blue 289C", "Royal Blue 294C", "Green 348C", "Orange 151C", "Yellow 115C", "Purple 268C", "Teal 316C", "Maroon 195C", "Forest 5535C"]
    }
  }

const deferJQ2 = (method)  => {
  if(window.fpdLib && fpdLib.jQuery) {
    method()
  } else {
    setTimeout(() => { deferJQ2(method)}, 50)
  }
}
const deferViewV2 = (method)  => {
  if(FPD && FPD.instance && FPD.instance.currentViewInstance) {
    method()
  } else {
    setTimeout(() => { deferViewV2(method)}, 50)
  }
}

const deferSecondView = (method) => {
  if(FPD && FPD.instance && FPD.instance.viewInstances[1]) {
    method()
  } else {
    setTimeout(() => { deferSecondView(method)}, 10)
  }
}

const MAX_NB_RETRY = 100;
const RETRY_DELAY_MS = 500;

async function fetchRetry(input) {
    let retryLeft = MAX_NB_RETRY;
    while (retryLeft > 0){
        try {
          const response = await fetch(input, { method: 'HEAD'});
          if(response.status != 200) {
            throw "Not 200"
          }
          return response
        }
        catch (err) { 
          await sleep(RETRY_DELAY_MS)
        }
        finally {
            retryLeft -= 1;
        }
    }
    throw new Error('Too many retries');
}

function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

deferJQ2(() => {
  const $ = fpdLib.jQuery
  
  FPD.shopOptions.shopify_no_redirect_after_add_to_cart = true
  FPD.shopOptions.shopify_no_reload_after_add_to_cart = true
  // FPD.shopOptions.shopify_atc_strategy = 'add_json'
  FPD.shopOptions.shopify_atc_strategy = 'save_to_form'
  // FPD.shopOptions.shopify_atc_excluded_field_names = ['form_type', 'utf8', 'product-id']
  FPD.shopOptions.fpdOverwrite = Object.assign({}, FPD.shopOptions.fpdOverwrite, {
    customImageParameters: {
      replace: 'replace'
    }
  })

  $(document).on('fpd:price:update', (e, data) => {
    console.log(data)
    var hiddenPrice = document.querySelector(".variant_price")
    if (hiddenPrice) hiddenPrice.value = data.priceEach
    // mapMsrpLogic(undefined, data.priceEach)
  })

  $(document).on('fpd:addToCart', (event, addedProduct) => {
    FPD.instance.toggleSpinner(true, 'Creating Product...')
    setTimeout(() => {
      FPD.productPage.atcOperator.setAtcButtonsDisabled(true)
    }, 500)
    fetchRetry('/products/' + FPD.productPage.licManager.currentLic.custom_handle + '.json')
      .then(res => { 
        FPD.productPage.$addToCartForm.submit()
      })
      .catch(err => {
        FPD.func.FPDUtil.showModal('<h2>There was an issue</h2><p>We could not add your product to the cart. Please just try again.</p>')
      })
  })
})

class PatternCanvasBase2 {
  static patternHeight = 20
  static maxCanvasWidth = 800

  constructor(canvasId = null, options = {}) {
    this.canvasId = canvasId
    this.options = Object.assign({ height: this.constructor.patternHeight, width: this.constructor.maxCanvasWidth + 20, crossOrigin: 'anonymous' }, options)
    if(FPD.debug) {
      console.debug("Create canvas with options: ", this.options)
    }
    this.canvas = new fabric.StaticCanvas(this.canvasId, this.options)
    this.spaceWidth = 20
  }

  get cw() {
    return this.options.width
  }

  get ch() {
    return this.options.height
  }

  setSpaceWidth(newWidth) {
    this.spaceWidth = newWidth
  }

  updateCanvasHeight(newHeight) {
    this.canvas.clear()
    this.options.height = newHeight

    this.canvas.setHeight(this.options.height)

    this.scaleImageElement()
    return this.updateCanvasContent().then(() => {
      this.updateCanvas()
    })
  }

  rebuildCanvasContent() {
    this.canvas.clear()
    this.addingPromises = []
    this.canvasContent.forEach(content => {
      const p = this.addContentElement(content)
      p.catch(error => console.log('error', error))
      this.addingPromises.push(p)
    })

  }

  addContentElement(content) {
    return new Promise((resolve, reject) => {
      switch(content.type) {
      case 'text':
        this.textElement.clone(newElement => {
          newElement.set({left: content.position,  originY: 'center', top: 0.5 * this.options.height})
          this.canvas.add(newElement)
          resolve('text')
        })
        break;
      case 'image':
        if(this.imageElement) {
          this.imageElement.clone(newElement => {
            newElement.set({left: content.position})
            this.canvas.add(newElement)
            newElement.centerV()
            resolve('image')
          })  
        } else {
          resolve('nothing')
        }
        break;
      case 'space':
        // do nothing
        resolve('space')
        break;
      case 'end':
        this.canvas.add(new fabric.Text("|", { left: content.position, originY: 'center', top: 0.5 * this.options.height, fill: '#7777ff' }) )
        resolve('end')
        break
      }
    })
  }

  updateImageElement(imageElement) {
    if(this.imageElement) {
      this.canvas.remove(this.imageElement)
    }
    if(!imageElement) {
      this.imageElement = null
      return Promise.resolve()
    }
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(imageElement.toDataURL(), (newImageElement) => {
        this.imageElement = newImageElement
        this.imageElement.set({ left: 0, top: 0, angle: 0, originX: 'left', originY: 'top' })
        this.scaleImageElement()

        resolve()
      }, { crossOrigin: 'Anonymous' })
    })
 }

 scaleImageElement() {
   if(this.imageElement) {
      let heightScaling = (this.ch * 0.8) / this.imageElement.height
      let widthScaling = (this.cw) / this.imageElement.width
      this.imageElement.scaleToHeight(this.ch * 0.8)
   }
 }

  updateTextElement(textElement) {
    this.textElement = textElement
    this.textElement.set({originX: 'left'})
  }

  updateCanvas() {
    this.canvas.renderAll()
  }

  getPatternElement() {
    return this.canvas.getElement()
  }

  getPatternDataUrl() {
    return this.canvas.toDataURL()
  }
}

class PatternCanvasContinues2 extends PatternCanvasBase2 {
  static maxCanvasWidth = 750

  updateCanvasContent() {
    let imageWidth = 0 
    if(this.imageElement) {
      imageWidth = this.imageElement.width * this.imageElement.scaleX
    }
    let textWidth = this.textElement.width

    this.canvasContent = []
    this.addingPromises = []
    this.canvasContentWidth = 0

    let keepAdding = true
    let first = true
    while(keepAdding) {
      // if space for text + image add
      // if space space for text add
      // if(first) {
      //   first = false
      // } else {
      //   this.addToCanvasContent('space', this.spaceWidth)
      // }
      // this.addToCanvasContent('text', textWidth)
      // this.addToCanvasContent('space', this.spaceWidth)
      // this.addToCanvasContent('image', imageWidth)

      if(this.canvasContentWidth + this.spaceWidth + textWidth + this.spaceWidth + imageWidth < this.constructor.maxCanvasWidth) {
        if(first) {
          first = false
        } else {
          this.addToCanvasContent('space', this.spaceWidth)
        }
        this.addToCanvasContent('text', textWidth)
        this.addToCanvasContent('space', this.spaceWidth)
        this.addToCanvasContent('image', imageWidth)
      } else {
        if(this.canvasContentWidth + this.spaceWidth + textWidth < this.constructor.maxCanvasWidth) {
          this.addToCanvasContent('space', this.spaceWidth)
          this.addToCanvasContent('text', textWidth)
        }
        keepAdding = false
      }       
    }
    // this.canvasContent.push({type: 'end', position: this.canvasContentWidth})
    
    this.rebuildCanvasContent()

    return Promise.all(this.addingPromises).then(() => {
      this.canvas.renderAll()
    })
  }

  addToCanvasContent(type, width, extraWidth = 0) {
    if(this.canvasContentWidth + width + extraWidth < this.constructor.maxCanvasWidth) {
      this.canvasContent.push({type: type, position: this.canvasContentWidth})
      this.canvasContentWidth += width
    }
  }
}

class PatternCanvasSymmetric2 extends PatternCanvasBase2 {
  static maxCanvasWidth = 600

  updateCanvasContent() {
    let imageWidth = 0 
    if(this.imageElement) {
      imageWidth = this.imageElement.width * this.imageElement.scaleX
    }
    let textWidth = this.textElement.width

    this.canvasContent = []
    this.addingPromises = []
    this.canvasContentWidth = 0

    this.keepAdding = true
    
    // this.addToCanvasContent('space', 150)
    if(imageWidth > 0) {
      if(this.options.startWithImage) {
        this.addToCanvasContent('image', imageWidth)
        this.addToCanvasContent('space', this.spaceWidth, textWidth)
        this.addToCanvasContent('text', textWidth)
        this.addToCanvasContent('space', this.spaceWidth, imageWidth)
        this.addToCanvasContent('image', imageWidth)
        this.addToCanvasContent('space', this.spaceWidth, textWidth)
        this.addToCanvasContent('text', textWidth)
      } else {
        this.addToCanvasContent('text', textWidth)
        this.addToCanvasContent('space', this.spaceWidth, imageWidth)
        this.addToCanvasContent('image', imageWidth)
        this.addToCanvasContent('space', this.spaceWidth, textWidth)
        this.addToCanvasContent('text', textWidth)
        this.addToCanvasContent('space', this.spaceWidth, imageWidth)
        this.addToCanvasContent('image', imageWidth)
      }
    } else {
      this.addToCanvasContent('text', textWidth)
      this.addToCanvasContent('space', this.spaceWidth, textWidth)
      this.addToCanvasContent('text', textWidth)
      this.addToCanvasContent('space', this.spaceWidth, textWidth)
      this.addToCanvasContent('text', textWidth)
      this.addToCanvasContent('space', this.spaceWidth, textWidth)
    }

    this.rebuildCanvasContent()

    return Promise.all(this.addingPromises).then(() => {
      this.canvas.renderAll()
    })
  }

  addToCanvasContent(type, width, nextWidth = 0) {
    if(this.canvasContentWidth + width + nextWidth < this.constructor.maxCanvasWidth && this.keepAdding) {
      this.canvasContent.push({ type: type, position: this.canvasContentWidth })
      this.canvasContentWidth += width
    } else {
      this.keepAdding = false
    }
  }
}

class LanyardHandler2 {
  constructor(view) {
    this.view = view
    this._patternSource = new PatternCanvasContinues3('static')
    this._patternSourceSymmetric = new PatternCanvasSymmetric2('static2')
    this._patternSourceSymmetricRight = new PatternCanvasSymmetric2('static3', { startWithImage: true })
    this._backgroundShapes = []
    this._finishingShapes = []
    this.finsihingImageUrl = null
    this.stage = view.stage
    this.isSymmetrical = false
    this.isDoubleEnded = FPD.onlyDoubleEnded || false
    this.lw = 37
    this.shapes = []
    this.lanyardColor = '#000000'
  }

  patternSource(right = false) {
    if(this.isSymmetrical) {
      if(right) {
        return this._patternSourceSymmetricRight
      }
      return this._patternSourceSymmetric
    } else {
      return this._patternSource
    }
  }
  get mode() {
    if(this.isSymmetrical && this.isDoubleEnded) {
      return 'double-symmetrical'
    }
    if(!this.isSymmetrical && this.isDoubleEnded) {
      return 'double-continues'
    }
    if(this.isSymmetrical && !this.isDoubleEnded) {
      return 'single-symmetrical'
    }
    if(!this.isSymmetrical && !this.isDoubleEnded) {
      return 'single-continues'
    }
    return 'unknown'
  }

  getPatternContinues(final = false) {
    let patternOptions = {
      source: this._patternSource.getPatternDataUrl(),
      repeat: 'no-repeat',
      crossOrigin : "anonymous",
      offsetX: 100
    }
    return new fabric.Pattern(patternOptions)
  }
  getPatternSymmetrical(final = false) {
    let patternOptions = {
      source: this._patternSourceSymmetric.getPatternDataUrl(),
      repeat: 'no-repeat',
      crossOrigin : "anonymous",
      // offsetX: (800 - this.lw - this._patternSourceSymmetric.canvasContentWidth) / 2
    }
    return new fabric.Pattern(patternOptions)
  }

  getPatternSymmetricalRight(final = false) {
    let patternOptions = {
      source: this._patternSourceSymmetricRight.getPatternDataUrl(),
      repeat: 'no-repeat',
      crossOrigin : "anonymous",
      offsetX: 600 - this.lw - this._patternSourceSymmetricRight.canvasContentWidth
      // offsetX: Math.max((600 - this._patternSourceSymmetricRight.canvasContentWidth - this.lw - 5), 0)
    }
    return new fabric.Pattern(patternOptions)
  }

  updateImageElement() {
    const imageElement = this.view.getElementByReplace('replace')
    if(imageElement) {
      return Promise.all([
        this._patternSource.updateImageElement(imageElement),
        this._patternSourceSymmetric.updateImageElement(imageElement),
        this._patternSourceSymmetricRight.updateImageElement(imageElement)
      ]).then(() => {
        this.updateAllPatternSources()
      })
    }
  }

  removeImageElement() {
    return Promise.all([
        this._patternSource.updateImageElement(null),
        this._patternSourceSymmetric.updateImageElement(null),
        this._patternSourceSymmetricRight.updateImageElement(null)
      ]).then(() => {
        this.updateAllPatternSources()
      }).then(() => {
        FPD.updateRemoveLogoButton()
      })
  }

  updateTextElement() {
    const textElement = this.view.getElementByTitle('Text')
    this._patternSource.updateTextElement(textElement)
    this._patternSourceSymmetric.updateTextElement(textElement)
    this._patternSourceSymmetricRight.updateTextElement(textElement)
    this.updateShapes()
  }

  // updatePatternSources() {
  //   this._patternSource.updateCanvas()
  //   this._patternSourceSymmetric.updateCanvas()
  //   this._patternSourceSymmetricRight.updateCanvas()
  // }

  updatePatternOffset() {
    if(this.isSymmetrical) {
      this.shapes[1].fill.offsetX = Math.max(600 - this._patternSourceSymmetricRight.canvasContentWidth - this.lw - 5, 0)
      this.updateStage()
    }
  }

  buildPolygons() {
    let pb = null
    switch(this.mode) {
      case 'single-continues':
        pb = new PolygonBuilderSC(this)
        break
      case 'single-symmetrical':
        pb = new PolygonBuilderSS(this)
        break
      case 'double-continues':
        console.log("double-continues")
        pb = new PolygonBuilderDC(this)
        break
      case 'double-symmetrical':
        pb = new PolygonBuilderDS(this)
        break
      default:
        throw new Error('unknown mode: ' + this.mode)
    }
    pb.build()
    return [pb.leftPolygon, pb.rightPolygon]
  }

  updateWidth(newWidth) {
    this.lw = newWidth
    Promise.all([
      this._patternSource.updateCanvasHeight(this.lw),
      this._patternSourceSymmetric.updateCanvasHeight(this.lw),
      this._patternSourceSymmetricRight.updateCanvasHeight(this.lw)
    ]).then( (promises) => {
      this.updateShapes()
      this.updateBackground()
      this.updateFinishings()
      this.updateBreakAway()
      this.updateEndfitting()
      setTimeout(() => {
        this.updateShapes()
      }, 500)
    })
  }

  updateShapes() {
    if(this.shapes.length > 0) {
      this.stage.remove(...this.shapes)
    }
    this.shapes = this.buildPolygons()
    this.stage.add(...this.shapes)
    this.stage.bringToFront(...this.shapes)

    this.updateStage()

    setTimeout(() => {
      this.updateStage()
    }, 50)
  }

  initBackgroundShapes() {
    const options = {
      left: 300,
      top: 100,
      angle: 0,
      fill: this.lanyardColor,
      selectable: FPD.debug,
      rotateable: FPD.debug,
      evented: FPD.debug,
      objectCaching: false,
      moveable: false,
    }
    if(this.isDoubleEnded) {
      this._backgroundShapes.push(new fabric.Polygon([
          { x: 0, y: this.lw },
          { x: this.lw, y: 0 },
          { x: this.lw, y: 800 },
          { x: 0, y: 800 },
          { x: 0, y: this.lw }
        ],
        {...options, fill: this.lanyardColor }
      ))
      this._backgroundShapes.push(new fabric.Polygon([
          { x: 400 - this.lw, y: 0 },
          { x: 400, y: this.lw },
          { x: 400, y: 800 },
          { x: 400 - this.lw, y: 800 },
          { x: 400 - this.lw, y: 0 }
        ],
        { ...options, left: 700 - this.lw, fill: this.lanyardColor }
      ))
    } else {
      this._backgroundShapes.push(new fabric.Polygon([
          { x: 0, y: this.lw },
          { x: this.lw, y: 0 },
          { x: 200 + (this.lw / 2), y: 800 },
          { x: 200 - (this.lw / 2), y: 800 },
          { x: 0, y: this.lw }
        ],
        {...options, fill: this.lanyardColor }
      ))
      this._backgroundShapes.push(new fabric.Polygon([
          { x: 400 - this.lw, y: 0 },
          { x: 400, y: this.lw },
          { x: 200 + (this.lw / 2), y: 800 },
          { x: 200 - (this.lw / 2), y: 800 },
          { x: 400 - this.lw, y: 0 }
        ],
        { ...options, left: 500 - this.lw / 2, fill: this.lanyardColor }
      ))
    }

    this._backgroundShapes.push(new fabric.Polygon([
        { x: 0, y: this.lw },
        { x: this.lw, y: 0 },
        { x: 400 - this.lw, y: 0 },
        { x: 400, y: this.lw },
        { x: 0, y: this.lw }
      ],
      options
    ))

    this.stage.add(...this._backgroundShapes)

  }

  updateBackground() {
    this.stage.remove(...this._backgroundShapes)
    this._backgroundShapes = []
    this.initBackgroundShapes()
    this.updateStage()
  }

  initFinshingShapes() {
    const options = {
      top: 900,
      angle: 0,
      selectable: false,
      rotateable: false,
      evented: false,
      objectCaching: false,
    }
    const cw = this.lw * 0.7

    if(this.finsihingImageUrl != null) {
      const loadingPromise = new Promise((resolve, reject) => {
        if(this.isDoubleEnded) {
          fabric.Image.fromURL(this.finsihingImageUrl, (imageRight) => {
            imageRight.cloneAsImage(imageLeft => {
              let angle = 90
              const imageScale = cw / imageRight.height
              const imageHeight = imageRight.width * imageScale
              imageRight.set({
                top: 900 + 30, left: 700 + (imageScale * imageRight.height) - ((this.lw - cw) / 2 + cw),
                scaleX: imageScale, scaleY: imageScale, angle: angle
              })
              this._finishingShapes.push(new fabric.Polygon([
                  { x: 0, y: 0 },
                  { x: this.lw, y: 0 },
                  { x: (this.lw - cw) / 2 + cw, y: 30 },
                  { x: (this.lw - cw) / 2, y: 30 },
                ],
                { ...options, top: 900, left: 700 - this.lw, fill: this.lanyardColor }
              ))
              this._finishingShapes.push(new fabric.Polygon([
                  { x: (this.lw - cw) / 2, y: 0 },
                  { x: (this.lw - cw) / 2 + cw, y: 0 },
                  { x: this.lw, y: 30 },
                  { x: 0, y: 30 },
                ],
                { ...options, top: 900 + 30 + imageHeight, left: 700 - this.lw, fill: this.lanyardColor }
              ))
              this._finishingShapes.push(imageRight)


              imageLeft.set({
                top: 900 + 30, left: 300 + (imageScale * imageRight.height) + ((this.lw - cw) / 2),
                scaleX: imageScale, scaleY: imageScale, angle: angle
              })
              this._finishingShapes.push(new fabric.Polygon([
                  { x: 0, y: 0 },
                  { x: this.lw, y: 0 },
                  { x: (this.lw - cw) / 2 + cw, y: 30 },
                  { x: (this.lw - cw) / 2, y: 30 },
                ],
                { ...options, top: 900, left: 300, fill: this.lanyardColor }
              ))
              this._finishingShapes.push(new fabric.Polygon([
                  { x: (this.lw - cw) / 2, y: 0 },
                  { x: (this.lw - cw) / 2 + cw, y: 0 },
                  { x: this.lw, y: 30 },
                  { x: 0, y: 30 },
                ],
                { ...options, top: 900 + 30 + imageHeight, left: 300, fill: this.lanyardColor }
              ))
              this._finishingShapes.push(imageLeft)

              resolve()
            })
          })
        } else {
          fabric.Image.fromURL(this.finsihingImageUrl, (imageCenter) => {

            const imageScale = cw / imageCenter.height
            const imageHeight = imageCenter.width * imageScale
            imageCenter.set({
              top: 900 + 30, left: 500 + this.lw / 2 + (imageScale * imageCenter.height) - ((this.lw - cw) / 2 + cw),
              scaleX: imageScale, scaleY: imageScale, angle: 90
            })
            this._finishingShapes.push(new fabric.Polygon([
                { x: 0, y: 0 },
                { x: this.lw, y: 0 },
                { x: (this.lw - cw) / 2 + cw, y: 30 },
                { x: (this.lw - cw) / 2, y: 30 },
              ],
              { ...options, top: 900, left: 500 - this.lw / 2, fill: this.lanyardColor }
            ))
            this._finishingShapes.push(new fabric.Polygon([
                { x: (this.lw - cw) / 2, y: 0 },
                { x: (this.lw - cw) / 2 + cw, y: 0 },
                { x: this.lw, y: 30 },
                { x: 0, y: 30 },
              ],
              { ...options, top: 900 + 30 + imageHeight, left: 500 - this.lw / 2, fill: this.lanyardColor }
            ))
            this._finishingShapes.push(imageCenter)

            resolve()
          })
        }
      })

      loadingPromise.then(() => {
        this.stage.add(...this._finishingShapes)
      })
      return loadingPromise
    } else {
      if(this.isDoubleEnded) {
        this._finishingShapes.push(new fabric.Polygon([
            { x: 0, y: 0 },
            { x: this.lw, y: 0 },
            { x: this.lw, y: 20 },
            { x: 0, y: 20 },
          ],
          { ...options, top: 900, left: 700 - this.lw, fill: this.lanyardColor }
        ))
        this._finishingShapes.push(new fabric.Polygon([
            { x: 0, y: 0 },
            { x: this.lw, y: 0 },
            { x: this.lw, y: 20 },
            { x: 0, y: 20 },
          ],
          { ...options, top: 900, left: 300, fill: this.lanyardColor }
        ))
      } else {
        this._finishingShapes.push(new fabric.Polygon([
            { x: 0, y: 0 },
            { x: this.lw, y: 0 },
            { x: this.lw, y: 20 },
            { x: 0, y: 20 },
          ],
          { ...options, top: 900, left: 500 - this.lw / 2, fill: this.lanyardColor }
        ))
      }
      this.stage.add(...this._finishingShapes)
      return Promise.resolve()
    }
  }

  updateFinishings(imageUrl = null) {
    imageUrl = imageUrl || fpdLib.jQuery("#finish-options select").find(":selected").attr('name')
    this.finsihingImageUrl = imageUrl
    this.stage.remove(...this._finishingShapes)
    this._finishingShapes = []
    this.initFinshingShapes()
    this.updateEndfitting()
    this.updateStage()
  }

  toggleSymmetrical(isSymmetrical) {
    this.isSymmetrical = isSymmetrical
    this.updateShapes()
  }

  toggleDouble(isDoubleEnded) {
    this.isDoubleEnded = isDoubleEnded
    this.updateBackground()
    this.updateFinishings()
    this.updateEndfitting()
    this.updateShapes()
    this.updateLayering()
  }

  updateEndfitting() {
    let endfittingLeft = this.view.getElementByReplace('endfittings')
    let endfittingRight = this.view.getElementByReplace('endfittings2')
    let endfittingsTop = this.finsihingImageUrl ? 1095 : 1035
    if(this.isDoubleEnded) {
      endfittingLeft.set('left', 299 + this.lw / 2)
      endfittingLeft.set('top', endfittingsTop)
      if(endfittingRight) {
        endfittingRight.set('left', 700 - this.lw / 2)
        endfittingRight.set('top', endfittingsTop)
      } else {
        this.view.addElement(
          'image',
          endfittingLeft.source,
          'Endfitting Right',
          {
            left: 700 - (this.lw / 2),
            scaleX: endfittingLeft.scaleX,
            scaleY: endfittingLeft.scaleY,
            top: endfittingLeft.top,
            draggable: endfittingLeft.draggable,
            resizable: endfittingLeft.resizable,
            replace: 'endfittings2'
          }
        )
      }
    } else {
      endfittingLeft.set('left', 500)
      endfittingLeft.set('top', endfittingsTop)
      if(endfittingRight) {
        this.view.removeElement(endfittingRight)
      }
    }
  }

  updateLanyardColor(newColor) {
    this.lanyardColor = newColor
    this.updateBackground()
    this.updateFinishings()
    this.updateShapes()
    this.updateLayering()
  }

  updateAllPatternSources() {
    return Promise.all([
      this._patternSource.updateCanvasContent().then(() => this.updateStage()),
      this._patternSourceSymmetric.updateCanvasContent().then(() => this.updateStage()),
      this._patternSourceSymmetricRight.updateCanvasContent().then(() => this.updateStage()),
    ])
  }

  updateStage() {
    this.stage.renderAll()
  }

  updateSpaceWidth(newWidth) {
    this._patternSource.setSpaceWidth(newWidth)
    this._patternSourceSymmetric.setSpaceWidth(newWidth)
    this._patternSourceSymmetricRight.setSpaceWidth(newWidth)
    this.updateAllPatternSources().then(() => {
      this.updateShapes()
    })
  }

  updateLayering() {
    const breakaway = this.view.getElementByReplace('breakaway')
    if(breakaway) {
      breakaway.bringToFront()
    }

    this.shapes[0].sendToBack()
    this._backgroundShapes[0].sendToBack()

    this.shapes[1].sendToBack()
    this._backgroundShapes[1].sendToBack()

    this._finishingShapes.forEach(element => {
      element.sendToBack()
    })

    this.view.getElementByReplace('endfittings').sendToBack()
    const endfitting2 = this.view.getElementByReplace('endfittings2')
    if(endfitting2) {
      endfitting2.sendToBack()
    }

    const background = this.view.getElementByReplace('background')
    if(background) {
      background.sendToBack()
    }
    const lanyardColors = this.view.getElementByReplace('colors_lanyard')
    if(lanyardColors) {
      lanyardColors.sendToBack()
    }
    const lanyardText = this.view.getElementByReplace('text_lanyard')
    if(lanyardText) {
      lanyardText.sendToBack()
    }
    const lanyardLogo = this.view.getElementByReplace('replace')
    if(lanyardLogo) {
      lanyardLogo.sendToBack()
    }
  }

  updateBreakAway() {
    const breakaway = this.view.getElementByReplace('breakaway')
    if(breakaway) {
      breakaway.set('top', this.lw / 2 + 100)
      breakaway.set('scaleX', this.lw / 100)
      breakaway.set('scaleY', this.lw / 100)
      breakaway.bringToFront()
      this.updateStage()
    }
  }

  finalizeCanvas() {
    this.shapes.forEach(shape => {
      shape.set('fill', this.getPattern(true))
    })
  }

  getCurrentPositions() {
    console.group(`${this.mode} Postion`)
    this.shapes.forEach((element, i) => {
      console.debug(`Polygon ${i}:`, 'left', element.left, 'top', element.top, 'width', element.width * element.scaleX, 'height', element.height * element.scaleY)
    })
    console.groupEnd(`${this.mode} Postion`)

    console.group("Background Postion")
    this._backgroundShapes.forEach((element, i) => {
      console.debug(`Polygon ${i}:`, 'left', element.left, 'top', element.top)
    })
    console.groupEnd("Background Postion")
  }
}

class PolygonBuilder {
  constructor(lanyardHandler) {
    this.leftPolygon = null
    this.rightPolygon = null
    this.lanyardHandler = lanyardHandler
    this.lw = this.lanyardHandler.lw
    this.defaults = {
      fill: this.lanyardHandler.getPatternContinues(),
      objectCaching: false,
      selectable: FPD.debug,
      evented: FPD.debug,
    }

    if(FPD.debug) {
      this.defaults = { ...this.defaults, stroke: 'black'}
    }
  }
}

class PolygonBuilderSC extends PolygonBuilder {
  build() {
    let leftTop = this.lw == 18 ? 895 : 895
    let rightTop = this.lw == 18 ? 130 : 107 + this.lw

    this.widthMapLeft = {
      18: { angle: -103.40, left: 490},
      31: { angle: -103.07, left: 482 },
      37: { angle: -102.90, left: 479},
      50: { angle: -103.40, left: 476}
    }
    this.widthMapRight = {
      18: { angle: 103.8 },
      31: { angle: 103.5 },
      37: { angle: 103.3 },
      50: { angle: 102.8 }
    }

    this.leftPolygon = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: 800 - this.lw, y: 0 },
        { x: 800 - this.lw, y: this.lw },
        { x: 0, y: this.lw },
      ],
      {
        ...this.defaults,
        left: this.widthMapLeft[this.lw].left,
        top: leftTop,
        angle: this.widthMapLeft[this.lw].angle
      }
    )
    this.rightPolygon = new fabric.Polygon([
        { x: 0, y: 0 },
        { x: 800 - this.lw, y: 0 },
        { x: 800 - this.lw, y: this.lw },
        { x: 0, y: this.lw },
      ],
      {
        ...this.defaults,
        left: 698,
        top: rightTop,
        angle: 104 - (this.lw / 40),
      }
    )
  }
}

class PolygonBuilderSS extends PolygonBuilder {
  constructor(lanyardHandler) {
    super(lanyardHandler)
    this.widthMapLeft = {
      12: { angle: -103.8, left: 490 - 46},
      18: { angle: -103.5, left: 485 - 46},
      31: { angle: -103.0, left: 478 - 46 },
      37: { angle: -102.8, left: 476 - 46},
      50: { angle: -103.0, left: 475 - 46}
    }
    this.widthMapRight = {
      12: { angle: 103.8 },
      18: { angle: 103.8 },
      31: { angle: 103.5 },
      37: { angle: 103.3 },
      50: { angle: 102.8 }
    }
  }
  build() {
    this.leftPolygon = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: 600 - this.lw, y: 0 },
        { x: 600 - this.lw, y: this.lw },
        { x: 0, y: this.lw },
      ],
      {
        ...this.defaults,
        left: this.widthMapLeft[this.lw].left,
        top: 685 + (this.lw / 5),
        angle: this.widthMapLeft[this.lw].angle,
        fill: this.lanyardHandler.getPatternSymmetrical()
      }
    )
    this.rightPolygon = new fabric.Polygon([
        { x: 0, y: 0 },
        { x: 600 - this.lw, y: 0 },
        { x: 600 - this.lw, y: this.lw },
        { x: 0, y: this.lw },
      ],
      {
        ...this.defaults,
        left: 700,
        top: 105 + this.lw,
        angle: this.widthMapRight[this.lw].angle,
        fill: this.lanyardHandler.getPatternSymmetricalRight()
      }
    )
  }
}


class PatternCanvasContinues3 extends PatternCanvasBase2 {
  static maxCanvasWidth = 2000

  updateCanvasContent() {
    let imageWidth = 0 
    if(this.imageElement) {
      imageWidth = this.imageElement.width * this.imageElement.scaleX
    } else {
      imageWidth = 0
    }
    let textWidth = this.textElement.width

    this.canvasContent = []
    this.addingPromises = []
    this.canvasContentWidth = 0

    let keepAdding = true
    let first = true
    while(keepAdding) {
      if(this.canvasContentWidth + this.spaceWidth + textWidth + this.spaceWidth + imageWidth < this.constructor.maxCanvasWidth) {
        this.addToCanvasContent('text', textWidth)
        this.addToCanvasContent('space', this.spaceWidth)
        if(imageWidth > 0) {
          this.addToCanvasContent('image', imageWidth)
          this.addToCanvasContent('space', this.spaceWidth)
        }
      } else {
        this.canvasContent.pop()
        this.canvasContentWidth -= this.spaceWidth
        keepAdding = false
      }
    }
    
    this.rebuildCanvasContent()

    return Promise.all(this.addingPromises).then(() => {
      this.canvas.renderAll()
    })
  }

  
  addToCanvasContent(type, width, extraWidth = 0) {
    // if(this.canvasContentWidth + width + extraWidth < this.constructor.maxCanvasWidth) {
      this.canvasContent.push({type: type, position: this.canvasContentWidth})
      this.canvasContentWidth += width
    // }
  }
}

class PolygonBuilderDC extends PolygonBuilder {
  build() {
    console.log("canvasContentWidth", this.lanyardHandler._patternSource.canvasContentWidth, 750 - this.lanyardHandler._patternSource.canvasContentWidth)
    
    let patternOptions = {
      source: this.lanyardHandler._patternSource.getPatternDataUrl(),
      repeat: 'no-repeat',
      crossOrigin : "anonymous",
      offsetX: 750 - this.lanyardHandler._patternSource.canvasContentWidth
    }
    let patternForLeft = new fabric.Pattern(patternOptions)

    patternOptions = {
      source: this.lanyardHandler._patternSource.getPatternDataUrl(),
      repeat: 'no-repeat',
      crossOrigin : "anonymous",
    }
    let patternForRight = new fabric.Pattern(patternOptions)
    
    this.leftPolygon = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: 750, y: 0 },
        { x: 750, y: this.lw },
        { x: 0, y: this.lw},
      ],
      {
        ...this.defaults,
        left: 300 + this.lw,
        // top: 100 + this.lw + (750 - this.lanyardHandler._patternSource.canvasContentWidth),
        top: 100 + this.lw,
        angle: 90,
        // stroke: 'red',
        fill: patternForLeft,
        // selectable: true,
        // evented: true
      }
    )
    this.rightPolygon = new fabric.Polygon([
        { x: 0, y: 0 },
        { x: 750, y: 0 },
        { x: 750, y: this.lw },
        { x: 0, y: this.lw },
      ],
      {
        ...this.defaults,
        left: 700 - this.lw,
        top: 900 - this.lw,
        angle: -90,
        // stroke: 'green',
        fill: patternForRight
      }
    )

  }
}

class PolygonBuilderDS extends PolygonBuilder {
  build() {
    this.leftPolygon = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: 600, y: 0 },
        { x: 600, y: this.lw },
        { x: 0, y: this.lw},
      ],
      {
        ...this.defaults,
        left: 300,
        top: 700 + this.lw,
        angle: -90,
        fill: this.lanyardHandler.getPatternSymmetrical()

      }
    )
    this.rightPolygon = new fabric.Polygon([
        { x: 0, y: 0 },
        { x: 750, y: 0 },
        { x: 750, y: this.lw },
        { x: 0, y: this.lw },
      ],
      {
        ...this.defaults,
        left: 700,
        top: 100 + this.lw,
        angle: 90,
        fill: this.lanyardHandler.getPatternSymmetricalRight()
      }
    )
  }
}

FPD.initLanyard = (view = null) => {
  FPD.debug = false
  const fpd = FPD.instance
  view = view || fpd.currentViewInstance

  const lh = new LanyardHandler2(view)

  lh.updateTextElement()
  lh.updateImageElement()

  lh.initBackgroundShapes()
  lh.initFinshingShapes()
  lh.updateShapes()

  fpd.$container.on('elementModify', (evt, element, parameters) => {
    if(element.replace == "replace") {
      lh.updateImageElement()
      setTimeout(() => {
        FPD.updateRemoveLogoButton()
        lh.updatePatternOffset()
        lh.updateShapes()
        lh.updateLayering()
      }, 250)
      setTimeout(() => {
        FPD.instance.deselectElement()
      }, 500)
    }
  })

  setTimeout(() => {
    lh.updateWidth(31)
    lh.updateStage()
  },1000)
  
  setTimeout(() => {
    lh.updateLayering()

    // fixing weired text change
    $('.fpd-text-layer-item:first-child textarea').text('Add text here')
  }, 2500)

  return lh
}

FPD.initLanyardColor = () => {
  const $ = fpdLib.jQuery

  const lanyardColors = FPD.instance.viewInstances[0].getElementByReplace('colors_lanyard')
  if(lanyardColors) {
    $('#lanyard-color select').empty()
    lanyardColors.colors.forEach(colorHex => {
      const colorNameKey = colorHex.substring(1).toLowerCase()
      $('#lanyard-color select').append($('<option>', {
        value: colorHex,
        text : FPD.instance.mainOptions.hexNames[colorNameKey] || colorHex,
        selected: colorHex == '#222222'
      }))
    })
  }
}

FPD.updatePrice = () => {
  const $ = fpdLib.jQuery

  const quantity = parseInt($('.quantity__input').val())
  const quantityBoundary = [100, 200, 500, 1000, 2500, 5000, 10000].find(v => v >= quantity)


  let imprintOption = $('#lanyard-imprint input[name="lanyard_imprint"]:checked').val()
  const rushOption = $('#lanyard-shipping input[name="lanyard_shipping"]:checked').val()
  const shippingOption = $('#lanyard-shipping input[name="lanyard_shipping"]:checked').val()
  const lanyardWidth = $('#lanyard-width select option:selected').text()
  const doubledEnded = $('.double input').is(':checked')
  const twoSided = $('.two-sided input[name="two-sided"]:checked').val() == 'custom'
  const twoSidedDuplicated = $('.two-sided input[name="two-sided"]:checked').val() == 'duplicated'
  const colorCountActive = !$('#logo-colors').hasClass('fpd-hidden')
  const colorCountPrice = $('#logo-colors input:checked').val()

  // console.debug('imprintOption', imprintOption, 'rushOption', rushOption, 'quantity', quantity, 'quantityBoundary', quantityBoundary, 'shippingOption', shippingOption, 'lanyardWidth', lanyardWidth, 'doubledEnded', doubledEnded, 'twoSided', twoSided)

  if(rushOption == 'rush') {
    imprintOption += '_rush'
  }
  
  let priceEach = priceTable[imprintOption][lanyardWidth][quantityBoundary]
  // console.log('widht/quantity price per each', priceEach)
  
  if(twoSided) {
    priceEach += priceTable[imprintOption]['other']['different_two_sided']
  }
  if(twoSidedDuplicated) {
    priceEach += priceTable[imprintOption]['other']['duplicated_two_sided']
  }
  if(doubledEnded) {
    priceEach += priceTable[imprintOption]['other']['double_ended']
  }
  if(FPD.currentBreakaway != 'no-breakaway') {
    priceEach += priceTable[imprintOption]['other']['breakaway']
  }
  if(colorCountActive && !isNaN(parseFloat(colorCountPrice))) {
    priceEach += parseFloat(colorCountPrice)
  }

  const fpdPrice = FPD.instance.viewInstances.length > 0 ? FPD.instance.viewInstances[0].truePrice : 0;
  FPD.priceEach = priceEach
  priceEach += fpdPrice
  // console.log('with fpd price', priceEach, fpdPrice)
  
  FPD.productPage.customPriceOperator.updatePrice(priceEach * 100)
  $(document).trigger('fpd:price:update', { priceEach: priceEach })
  //fpdLib.jQuery(document).on('fpd:price:update', (e, data) => console.log(data))
}

FPD.updateAvailability = () => {
  const $ = fpdLib.jQuery
  
  let imprintOption = $('#lanyard-imprint input[name="lanyard_imprint"]:checked').val()
  const rushOption = $('#lanyard-shipping input[name="lanyard_shipping"]:checked').val()
  const lanyardWidthSelection = $('#lanyard-width select option')

  const shippingSelection = $('#lanyard-shipping input')
  const imprintSelection = $('#lanyard-imprint input')
  const colorSelection = $('#lanyard-color select option')
  const breakawaySelection = $('.lanyard-breakaway .fpd-grid .fpd-item')
  const endfittingsSelection = $('.lanyard-endfittings .fpd-grid .fpd-item')
  const colorCount = $('#logo-colors')
  
  const twoSidedSelection = $('.two-sided input')
  const symmetricalSelection = $('.symmeterical input')

  if(rushOption == 'rush') {
    imprintOption += '_rush'
  }

  if(['one_color_silk', 'three_color_silk', 'three_color_silk_rush'].includes(imprintOption)) {
    console.log("color_price")
    colorCount.removeClass('fpd-hidden')
  } else {
    console.log("not color_price")
    colorCount.addClass('fpd-hidden')
  }

  const shippingOptions = avTable[imprintOption]['shipping']
  $.each(shippingSelection, (index, item) => {
    let $item = $(item)
    if(shippingOptions.includes($item.val())) {
      $item.attr('disabled', false)
    } else {
      $item.attr('disabled', true)
    }
  })

  const imprintOptions = avTable[imprintOption]['imprint']
  $.each(imprintSelection, (index, item) => {
    let $item = $(item)
    if(imprintOptions.includes($item.val())) {
      $item.attr('disabled', false)
    } else {
      $item.attr('disabled', true)
    }
  })

  const colorOption = avTable[imprintOption]['colors']
  $.each(colorSelection, (index, item) => {
    $item = $(item)
    if(colorOption.includes($item.text())) {
      $item.attr('disabled', false)
    } else {
      $item.attr('disabled', true)
      if($item.is(':selected')) {
        $('#lanyard-color select').val('#222222')
        $('#lanyard-color select').trigger('change')
        const newColor = '#222222'  
        FPD.lhs[0].updateLanyardColor(newColor)
        if(typeof FPD.lhs[1] != 'undefined') {
          FPD.lhs[1].updateLanyardColor(newColor)
        }
      }
    }
  })

  const widthOptions = avTable[imprintOption]['width']
  $.each(lanyardWidthSelection, (index, item) => {
    $item = $(item)
    if(widthOptions.includes($item.text())) {
      $item.attr('disabled', false)
    } else {
      $item.attr('disabled', true)
      if($item.is(':selected')) {
        $('#lanyard-width select option:not([disabled]):first').prop('selected', true)
        $('#lanyard-width select').trigger('change')
      }
    }
  })

  const allowedEndfittings = avTable[imprintOption]['endFittings']
  let endfittingSwitched = false
  let $newItem = null
  $.each(endfittingsSelection, (index, item) => {
    const $item = $(item)
    if(allowedEndfittings == 'all' || allowedEndfittings.includes($item.data('title'))) {
      $item.show()
      $item.removeClass('fpd-hidden')
      if(endfittingSwitched == false) {
        endfittingSwitched = true
        $newItem = $item
      }
    } else {
      // console.log('endfitting hide', $item.data('title'))
      $item.hide()
    }
  })
  $newItem ? $newItem.click() : ''
  
  const allowBreakaway = avTable[imprintOption]['breakaway']
  $.each(breakawaySelection, (index, item) => {
    if($(item).data('title') == 'breakaway-default') {
      $(item).click()
    } else {
      allowBreakaway ? $(item).show() : $(item).hide()
    }
  })

  const allowTwoSided = avTable[imprintOption]['twoSided']
  if(allowTwoSided) {
    twoSidedSelection.each((i, item) => {
      $(item).prop('disabled', false )
    })
  } else {
    twoSidedSelection.each((i, item) => {
      $(item).prop('disabled', true)
      if(i == 0) {
        $(item).prop('checked', true)  
      } else {
        $(item).prop('checked', false)  
      }
      
    })
    $(twoSidedSelection[0]).trigger("change")
  }

  const allowSymmetrical = avTable[imprintOption]['symmetrical']
  if(allowSymmetrical) {
    symmetricalSelection.attr('disabled', false )
  } else {
    symmetricalSelection.prop('checked', false )
    symmetricalSelection.trigger('change')
    symmetricalSelection.attr('disabled', true )
  }
}

deferViewV2(() => {
  const $ = fpdLib.jQuery
  FPD.currentEndfittings = ''
  FPD.currentBreakaway = ''
  FPD.lhs = [
    FPD.initLanyard(FPD.instance.viewInstances[0])
  ]
  FPD.initLanyardColor()
  FPD.lh = FPD.lhs[0]
  $(".fpd-views-wrapper").hide()

  FPD.duplicateFirstView = () => {
    viewInstance = FPD.instance.viewInstances[0]

    const viewElements = viewInstance.stage.getObjects()
    const jsonViewElements = []

    for(var j=0; j < viewElements.length; ++j) {
      var element = viewElements[j];

      if(element.title !== undefined && element.source !== undefined) {
        var jsonItem = {
          title: element.title,
          source: element.source,
          parameters: viewInstance.getElementJSON(element),
          type: FPD.func.FPDUtil.getType(element.type)
        };

        jsonViewElements.push(jsonItem)
      }
    }

    FPD.instance.addView({
      title: 'Back',
      thumbnail: 'https://dm4hy9ysctu8v.cloudfront.net/sites/specialistid-com-myshopify-com/shop/26DWKiYnGA2pmHcKs_original.png', //viewInstance.thumbnail,
      elements: jsonViewElements,
      options: viewInstance.options
    })
  }

  $("#lanyard-content .symmeterical input").on('change', (e) => {
    if($(e.target).is(':checked')) {
      FPD.lh.toggleSymmetrical(true)
    } else {
      FPD.lh.toggleSymmetrical(false)
    }
    
    FPD.updatePrice()
  })

  $(".double input").on('change', (e) => {
    let isDouble = false
    if($(e.target).is(':checked')) {
      isDouble = true
    }
    FPD.lhs[0].toggleDouble(isDouble)
    if(typeof FPD.lhs[1] != 'undefined') {
      FPD.lhs[1].toggleDouble(isDouble)
    }

    FPD.updatePrice()
  })

  $($(".fpd-views-wrapper .fpd-item")[0]).click(() => {
    FPD.lh = FPD.lhs[0]
  })
  $($(".fpd-views-wrapper .fpd-item")[1]).click(() => {
    FPD.lh = FPD.lhs[1]
  })

  $(".two-sided input").on('change', (e) => {
    if($('.two-sided input[name="two-sided"]:checked').val() == 'custom') {
      FPD.duplicateFirstView()
      deferSecondView(() => {
        $(".fpd-views-wrapper").show()
        // $(".fpd-views-wrapper .fpd-item")[1].click()

        const backSideView = FPD.instance.viewInstances[1]
        const viewLabel = backSideView.getElementByTitle("Side")
        if(viewLabel) {
          viewLabel.set('text', 'back')
        }
        FPD.lhs[1] = FPD.initLanyard(backSideView)
        FPD.lhs[1].toggleSymmetrical(FPD.lhs[0].isSymmetrical)
        FPD.lhs[1].toggleDouble(FPD.lhs[0].isDoubleEnded)
      })
    } else {
      $(".fpd-views-wrapper .fpd-item")[0].click()
      $(".fpd-views-wrapper").hide()
      FPD.instance.removeView(1)
      FPD.lhs[1] = undefined
    }

    FPD.updatePrice()
  })

  $('#space-width').on('change', (e) => {
    let newWidth = parseInt($(e.target).val())
    FPD.lh.updateSpaceWidth(newWidth)
  })

  $('#font-size').on('change', (e) => {
    let newSize = parseInt($(e.target).val())
    $('#fpd-text-input input[type=number]').val(newSize)
    $('#fpd-text-input input[type=number]').trigger('change')
    FPD.lh.updateAllPatternSources()
  })

  $('#finish-options').on('change', (e) => {
    console.log('finish options', $(e.target).find(":selected").attr('name'))

    FPD.lhs[0].updateFinishings()
    if(typeof FPD.lhs[1] != 'undefined') {
      FPD.lhs[1].updateFinishings()
    }

    FPD.updatePrice()
  })

  $('#lanyard-width select').on('change', (e) => {
    let newSize = parseInt($(e.target).val())
    let newFontSize = newSize * fabric.DPI / 72
    let currentFontSize = parseInt($('#fpd-text-input input[type=number]').val())

    if(newFontSize < currentFontSize) {
      $('#fpd-text-input input[type=number]').val(newFontSize)
      $('#fpd-text-input input[type=number]').trigger('change')
    }

    FPD.lhs[0].updateWidth(newSize)
    FPD.lhs[0].getCurrentPositions()
    if(typeof FPD.lhs[1] != 'undefined') {
      FPD.lhs[1].updateWidth(newSize)
      FPD.lhs[1].getCurrentPositions()
    }
    FPD.updatePrice()
  })

  $('body').on('elementModify', (evt, element, parameters) => {
    if(element.title == 'Text') {
      // console.log('text modified', element.text)
      FPD.lhs[0].updateAllPatternSources()
      if(typeof FPD.lhs[1] != 'undefined') {
        FPD.lhs[1].updateAllPatternSources()
      }

      if(FPD.updateTimeoutID) {
        clearTimeout(FPD.updateTimeoutID)
      }

      FPD.updateTimeoutID = setTimeout(() => {
        FPD.lhs[0].updateShapes()
        if(typeof FPD.lhs[1] != 'undefined') {
          FPD.lhs[1].updateShapes()
        }
      }, 2000)
    }
  })

  $('#lanyard-color select').on('change', (e) => {
    let newColor = $(e.target).val()
    // console.log('lanyard color', newColor)

    FPD.lhs[0].updateLanyardColor(newColor)
    if(typeof FPD.lhs[1] != 'undefined') {
      FPD.lhs[1].updateLanyardColor(newColor)
    }
  })

  $(FPD.instance.$container).on('fpd:design-added', (_e, data) => {
    // todo - view 2
    if(data && data.parameters && data.parameters.replace == 'endfittings') {
      // console.log("design updated", data.title, data.parameters)
      FPD.currentEndfittings = data.title

      if(FPD.instance.viewInstances[0].getElementByReplace('endfittings2')) {
        FPD.instance._addCanvasDesign(
          data.source,
          data.title,
          { ...data.parameters, replace: 'endfittings2' }
        )
        FPD.lh.updateLayering()
      }
      FPD.updatePrice()
    }
    if(data && data.parameters && data.parameters.replace == 'breakaway') {
      FPD.currentBreakaway = data.title
      FPD.lhs[0].updateBreakAway()
      setTimeout(() => {
        FPD.updatePrice()
        FPD.lhs[0].updateBreakAway()
        if(typeof FPD.lhs[1] != 'undefined') {
          FPD.lhs[1].updateBreakAway()
        }
      }, 250)
    }
  })

  $('.quantity__input').change((_e) => {
    FPD.updatePrice()
  })
  $('#lanyard-imprint input[name="lanyard_imprint"]').change((_e) => {
    FPD.updatePrice()
    FPD.updateAvailability()
  })
  $('#lanyard-shipping input[name="lanyard_shipping"]').change((_e) => {
    FPD.updatePrice()
    FPD.updateAvailability()
  })
  $('#logo-colors input').change((_e) => {
    FPD.updatePrice()
    FPD.updateAvailability()
  })
  
  FPD.closeHeadlineAll = () => {
    if(FPD.onlyDoubleEnded) return
    $('.form__headline').each((index, item) => {
      if(!$(item).hasClass('collapsed')) {
        $(item).toggleClass('collapsed')
        $(item).siblings('.lanyard-collaps').slideToggle()
      }
    })  
  }

  let firstTime = true
  $('.form__headline').on('click', (e) => {
    let $e = $(e.target)
    if($e.hasClass('collapsed')) {
      FPD.closeHeadlineAll()
    
      $e.removeClass('collapsed')
      $e.siblings('.lanyard-collaps').slideToggle()  
    }
  })
  FPD.closeHeadlineAll()
  $($('.form__headline')[0]).click()
  
  $(document).on('fpd:price:change', (event, data)=>{
    FPD.updatePrice()
  })

  $("#remove-logo").click(() => {
    FPD.lh.removeImageElement().then(() => {
      FPD.lh.updateShapes()  
    })
  })
  
  FPD.updateRemoveLogoButton = () => {
    const $removeLogoButton = $('#remove-logo')
    FPD.lh._patternSource.imageElement == null ? $removeLogoButton.hide() : $removeLogoButton.show()
  }
  FPD.updatePrice()
  FPD.updateAvailability()

  $('#lanyard-additional > div > div:nth-child(2) .fpd-scroll-area').height('135px')

  $("#lanyard-imprint .explainer").click(() => {
    document.querySelector('#product-description h3').scrollIntoView({ behavior: 'smooth'})
  })

  if(FPD.onlyDoubleEnded) {
    $('.double input').parent().hide()
  } 
  
  // Adjust Priceing calculation
  FPD.productPage.licManager.getCalculatedPrice = () => FPD.instance.calculatePrice() + FPD.priceEach
  setTimeout(() => {
    FPD.lh.removeImageElement()
  }, 500)
})