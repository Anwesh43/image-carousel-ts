const w : number = window.innerWidth 
const h : number = window.innerHeight
const delay : number = 20 


const getSize : Function = () : number => Math.min(w, h) / 2 

class Stage {

    div : HTMLDivElement = document.createElement('div')
    
    initStyle() {
        const size : number = getSize()
        this.div.style.width = `${size}px` 
        this.div.style.height = `${size}px`
        this.div.style.position = 'absolute'
        this.div.style.left = `${w / 2 - size / 2}px`
        this.div.style.top = `${h / 2 - size / 2}px`
        this.div.style.border = '1px dotted black'
        document.body.appendChild(this.div)
    }

    handleKey() {
        const codeActionMap : Record<string, Function> = {
            "Up": () => {},
            "Down": () => {}
        }
        window.onkeydown = (e : KeyboardEvent) => {
            if (e.code in codeActionMap) {
                codeActionMap[e.code]()
            }           
        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initStyle()
    }

}

class Animator {

    animated : boolean = false 
    interval : number 

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}

class State {

    scale : number = 0 

    update(cb : Function) {
        this.scale += 0.02 
        if (Math.abs(this.scale) > 1) {
            this.scale = 0 
            cb()
        }
    }
}

class ImageContainer {

    div : HTMLDivElement = document.createElement('div')
    screen : HTMLDivElement = document.createElement('div')
    index : number = 0 
    dw : number = 0
    state : State = new State()

    initStyle() {
        const size : number = getSize()
        this.div.style.height = `${size}px`
        this.div.style.width = `${size}px`
        this.div.style.position = 'absolute'
        this.screen.style.height = `${size}px`
        this.screen.style.width = `${size}px`
        this.screen.style.position = 'absolute'
        this.div.style.overflow = 'none'
        this.screen.style.float = 'left'
        this.div.appendChild(this.div)
        document.body.appendChild(this.div)
    }

    addImage(img : HTMLImageElement) {
        const size : number = getSize()
        img.style.width = `${size}px`
        img.style.height = `${size}px`
        this.screen.style.width = `${parseFloat(this.screen.style.width) + size}px`
        this.screen.appendChild(img)
    }

    next() {
        if (this.index === this.screen.children.length) {
            return 
        }
        const size : number = getSize()
        const x = size * (-this.index) - size  
        this.div.style.left = `${x}px`
    }

    right() {
        
        if (this.index === 0) {
            return 
        }
        const size : number = getSize()
        const x = size * (-this.index) + size  
        this.div.style.left = `${x}px`
    }

    shouldUpdate(dir : number) {
        if (dir == 1 && this.index === this.screen.children.length) {
            return false 
        }
        if (dir == -1 && this.index === 0) {
            return false 
        }
        return true
    }

    start(cb : Function, dir : number = 1) {
        if (this.shouldUpdate(dir)) {
            cb()
        }
        if (dir == 1) {
            this.next()
        } else {
            this.right()
        }
        this.state.update(() => {
            this.index += dir  
            cb()
        })
    }
}