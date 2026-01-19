const deferView = (method)  => {
  if(FPD && FPD.instance && FPD.instance.currentViewInstance) {
    method()
  } else {
    setTimeout(() => { deferView(method)}, 50)
  }
}

const deferJQ2 = (method)  => {
  if(window.fpdLib && fpdLib.jQuery) {
    method()
  } else {
    setTimeout(() => { deferJQ2(method)}, 50)
  }
}

class PatternCanvasBase {
  static patternWidth = 28
  static maxCanvasWidth = 484

  constructor(canvasId = null, options = {}) {
    this.canvasId = canvasId
    this.options = Object.assign({ height: this.constructor.patternWidth, width: this.constructor.maxCanvasWidth + 20, crossOrigin: 'anonymous' }, options)
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
          newElement.set({left: content.position, originY: 'center', top: 0.5 * this.ch})
          this.canvas.add(newElement)
          newElement.centerV()
          resolve('text')
        })
        break;
      case 'image':
        if(this.imageElement) {
          this.imageElement.clone(newElement => {
            newElement.set({left: content.position, originY: 'center', top: 0.5 * this.ch})
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

        let heightScaling = (this.ch - 10) / this.imageElement.height
        let widthScaling = (this.cw) / this.imageElement.width

        // if( heightScaling < widthScaling ) {
          this.imageElement.scaleToHeight(this.ch * 0.8)
        // } else {
          // this.imageElement.scaleToWidth(this.cw)
        // }
        resolve()
      }, { crossOrigin: 'Anonymous' })
    })
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

class PatternCanvasContinues extends PatternCanvasBase {
  static maxCanvasWidth = 600

  updateCanvasContent() {
    let imageWidth = 0 
    if(this.imageElement) {
      imageWidth = this.imageElement.width * this.imageElement.scaleX
    }
    let textWidth = this.textElement.width

    this.canvasContent = []
    this.canvasContentWidth = 0

    while(this.canvasContentWidth < this.constructor.maxCanvasWidth) {
      this.addToCanvasContent('text', textWidth)
      this.addToCanvasContent('space', this.spaceWidth)
      this.addToCanvasContent('image', imageWidth)
      this.addToCanvasContent('space', this.spaceWidth)
    }

    this.rebuildCanvasContent()

    return Promise.all(this.addingPromises).then(() => {
      this.canvas.renderAll()
    })
  }

  addToCanvasContent(type, width) {
    if(this.canvasContentWidth + width < this.constructor.maxCanvasWidth) {
      this.canvasContent.push({type: type, position: this.canvasContentWidth})
      this.canvasContentWidth += width
    } else {
      this.canvasContentWidth = this.constructor.maxCanvasWidth
    }
  }
}

class PatternCanvasSymmetric extends PatternCanvasBase {
  static maxCanvasWidth = 484

  updateCanvasContent() {
    let imageWidth = 0 
    if(this.imageElement) {
      imageWidth = this.imageElement.width * this.imageElement.scaleX
    }
    let textWidth = this.textElement.width

    this.canvasContent = []
    this.canvasContentWidth = 0

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
    
    this.rebuildCanvasContent()

    return Promise.all(this.addingPromises).then(() => {
      this.canvas.renderAll()
    })
  }

  addToCanvasContent(type, width) {
    if(this.canvasContentWidth + width < this.constructor.maxCanvasWidth) {
      this.canvasContent.push({type: type, position: this.canvasContentWidth})
      this.canvasContentWidth += width
    } else {
      this.canvasContentWidth = this.constructor.maxCanvasWidth
    }
  }
}

class LanyardHandler {
  constructor(patternSource, patternSourceSymmetric, patternSourceSymmetricRight, stage) {
    this.patternSource = patternSource
    this.patternSourceSymmetric = patternSourceSymmetric
    this.patternSourceSymmetricRight = patternSourceSymmetricRight
    this.stage = stage
    this.isSymmetrical = false
  }

  getPattern(final = false) {
    if(FPD.debug) { 
      console.log('this.patternSourceSymmetrical', this.patternSource)
    }
    return new fabric.Pattern({
      source: this.patternSource.getPatternDataUrl(),
      repeat: 'no-repeat',
      crossOrigin : "anonymous"
    })
  }

  getPatternSymmetric(final = false) {
    if(FPD.debug) { 
      console.log('this.patternSource', this.patternSourceSymmetric)
    }
    return new fabric.Pattern({
      source: this.patternSourceSymmetric.getPatternDataUrl(),
      repeat: 'no-repeat',
      crossOrigin : "anonymous"
    })
  }
  
  getPatternSymmetricRight(final = false) {
    if(FPD.debug) { 
      console.log('this.patternSource', this.patternSourceSymmetricRight)
      console.log('contentWidth', this.patternSourceSymmetricRight.canvasContentWidth)
    }
    let offsetX = 0
    this.offsetBase ||= 460
    if(this.patternSourceSymmetricRight.canvasContentWidth) {
      offsetX = this.offsetBase - this.patternSourceSymmetricRight.canvasContentWidth
    }
    return new fabric.Pattern({
      source: this.patternSourceSymmetricRight.getPatternDataUrl(),
      repeat: 'no-repeat',
      crossOrigin : "anonymous",
      offsetX: this.offsetX ? this.offsetX : offsetX
    })
  }

  getLeftPolygonContinues() {
    return new fabric.Polygon([
        { x: 0, y: 0 },
        { x: 600, y: 0 },
        { x: 600, y: 28 },
        { x: 0, y: 28 },
      ],
      {
        left: 488,
        top: 690,
        angle: -100,
        fill: this.getPattern(),
        // stroke: 'red',
        objectCaching: false,
        selectable: false,
        evented: false
      }
    )
  }

  getRightPolygonContinues() {
    return new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: 590, y: 0 },
        { x: 500, y: 28 },
        { x: 0, y: 28 },
      ],
      {
        left: 615,
        top: 98,
        angle: 100,
        fill: this.getPattern(),
        // stroke: 'red',
        objectCaching: false,
        selectable: false,
        evented: false
      }
    )
  }

  getLeftPolygonSym() {
    return new fabric.Polygon([
        { x: 0, y: 0 },
        { x: 464, y: 0 },
        { x: 464, y: 28 },
        { x: 0, y: 28 },
      ],
      {
        left: 466,
        top: 560,
        angle: -100,
        fill: this.getPatternSymmetric(),
        // stroke: 'red',
        objectCaching: false,
        selectable: true,
        evented: true
      }
    )
  }

  getRightPolygonSym() {
    const polygon = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: 464, y: 0 },
        { x: 464, y: 28 },
        { x: 0, y: 28 },
      ],
      {
        left: 615,
        top: 103,
        angle: 100,
        fill: this.getPatternSymmetricRight(),
        // stroke: 'red',
        objectCaching: false,
        selectable: false, 
        evented: false
      }
    )
    // polygon.set('flipY', true)
    // polygon.set('flipX', true)
    return polygon
  }

  getActivePatternSource() {
    if(this.isSymmetrical) {
      return [this.patternSourceSymmetric, this.patternSourceSymmetricRight]
    }
    return [this.patternSource]
  }
  initShapes(symmetrical = false) {
    this.isSymmetrical = symmetrical
    this.shapesSym = [this.getLeftPolygonSym(), this.getRightPolygonSym()]
    this.shapesCon = [this.getLeftPolygonContinues(), this.getRightPolygonContinues()]

    if(this.isSymmetrical) {
      this.stage.add(...this.shapesSym)
    } else {
      this.stage.add(...this.shapesCon)
    }
    this.updateStage()
    setTimeout(() => {
      this.updateStage()
    }, 50)
  }

  updateShapes() {
    if(this.shapesSym) {
      this.stage.remove(...this.shapesSym)
    }
    if(this.shapesCon) {
      this.stage.remove(...this.shapesCon)
    }
    this.initShapes(this.isSymmetrical)

    // this.updateStage()

    // setTimeout(() => {
    //   this.updateStage()
    // }, 50)
  }

  switchMode() {
    if(this.isSymmetrical) {
      // this.stage.remove(...this.shapesSym)
      // this.stage.add(...this.shapesCon)
      this.isSymmetrical = false
    } else {
      // this.stage.remove(...this.shapesCon)
      // this.stage.add(...this.shapesSym)
      this.isSymmetrical = true
    }
    this.updateAll()
  }

  updateAll() {
    const promises = this.getActivePatternSource().map(ps => ps.updateCanvasContent())
    Promise.all(promises).then(() => { 
      this.updateShapes()
      this.updateStage() 
    })
  }
  
  updateStage() {
    this.stage.renderAll()
  }

  updateSpaceWidth(newWidth) {
    this.getActivePatternSource().setSpaceWidth(newWidth)
    this.updateAll()
  }

  removeImageElement() {
    return Promise.all([
      this.patternSource.updateImageElement(null),
      this.patternSourceSymmetric.updateImageElement(null),
      this.patternSourceSymmetricRight.updateImageElement(null)
    ]).then(() => {
      this.updateAll()
    })
  }


  finalizeCanvas() {
    let shapes = null
    if(this.isSymmetrical) {
      this.shapesSym.forEach(shape => {
        shape.set('fill', this.getPatternSymmetric(true))
      })
    } else {
      this.shapesCon.forEach(shape => {
        shape.set('fill', this.getPattern(true))
      })
    }
  }

  getCurrentPositions() {
    console.group("Symmetric Postion")
    this.shapesSym.forEach((element, i) => {
      console.debug(`Polygon ${i}:`, 'left', element.left, 'top', element.top)
    })
    console.groupEnd("Symmetric Postion")
    console.group("Continues Postion")
    this.shapesCon.forEach((element, i) => {
      console.debug(`Polygon ${i}:`, 'left', element.left, 'top', element.top)
    })
    console.groupEnd("Continues Postion")
  }
}

FPD.initLanyard = () => {
  const fpd = FPD.instance
  const view = fpd.currentViewInstance

  const pc = new PatternCanvasContinues('static')
  const pcs = new PatternCanvasSymmetric('static2')
  const pcsr = new PatternCanvasSymmetric('static3', { startWithImage: true })
  pc.updateTextElement(view.getElementByTitle('Text'))
  pcs.updateTextElement(view.getElementByTitle('Text'))
  pcsr.updateTextElement(view.getElementByTitle('Text'))
  
  Promise.all([
    pc.updateImageElement(view.getElementByTitle('Logo')),
    pcs.updateImageElement(view.getElementByTitle('Logo')),
    pcsr.updateImageElement(view.getElementByTitle('Logo'))
  ]).then(() => {
    Promise.all([
      pc.updateCanvasContent(),
      pcs.updateCanvasContent(),
      pcsr.updateCanvasContent()
    ]).then(() => {
      FPD.lh.updateShapes()
    })
  })

  FPD.updateLanyardImage = (evt, element, parameters) => {
    // changed image
    if(element.replace == 'replace') {
      Promise.all([
        pc.updateImageElement(view.getElementByReplace('replace')),
        pcs.updateImageElement(view.getElementByReplace('replace')),
        pcsr.updateImageElement(view.getElementByReplace('replace'))
      ]).then(() => {
        view.getElementByReplace('replace').sendToBack()
        FPD.lh.updateAll()
      })
    }
    // changed text
    if(element.title == 'Text') {
      if(FPD.updateTimeoutID) {
        clearTimeout(FPD.updateTimeoutID)
      }
      FPD.updateTimeoutID = setTimeout(() => {
        Promise.all([
          pc.updateCanvasContent(),
          pcs.updateCanvasContent(),
          pcsr.updateCanvasContent()
        ]).then(() => {
          FPD.lh.updateShapes()
        })
      }, 2000)
    }
  }
  
  fpd.$container.on('elementModify', FPD.updateLanyardImage)
 
  const lh = new LanyardHandler(pc, pcs, pcsr, view.stage)
  lh.initShapes()
  FPD.lh = lh
  FPD.pc = pc
  FPD.pcs = pcs
  FPD.pcsr = pcsr

  setTimeout(() => {
    FPD.lh.updateStage()
  },1000)
}

FPD.removeLanyard = () => {
  FPD.lh = null
  FPD.pc = null
  FPD.pcs = null
  FPD.pcsr = null
}

deferJQ2(() => {
  const $ = fpdLib.jQuery
  FPD.shopOptions.fpdOverwrite = Object.assign({}, FPD.shopOptions.fpdOverwrite, {
    customImageParameters: {
      replace: 'replace'
    }
  })
})
  
deferView(() => {
  if(6706440518 == FPD.productPage.getShopifyProduct().id) {
    FPD.initLanyard()  
    FPD.instance.mainOptions.customImageParameters.autoSelect = false
  }

  $("#lanyard-content .symmeterical input").on('change', () => { FPD.lh.switchMode() })
  $('#space-width').on('change', (e) => { 
    let newWidth = parseInt($(e.target).val()) 
    FPD.lh.updateSpaceWidth(newWidth) 
  })
  $('#font-size').on('change', (e) => { 
    let newSize = parseInt($(e.target).val())
    $('#fpd-text-input input[type=number]').val(newSize)
    $('#fpd-text-input input[type=number]').trigger('change')
    FPD.lh.updateAll()
  })
  $('[data-action="reset-product"]').click(function() {
    console.log('reset')
    window.location.reload()
  })
  setTimeout(() => {
    FPD.lh.removeImageElement()
  }, 500)
})