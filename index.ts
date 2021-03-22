const w : number = window.innerWidth 
const h : number = window.innerHeight
const delay : number = 20 

class Stage {

    div : HTMLDivElement = document.createElement('div')
    
    initStyle() {
        const size : number = Math.min(w, h) / 3
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