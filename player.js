class Player {
    constructor(s) {
        this.size = s;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.x = window.innerWidth/2;
        this.y = window.innerHeight/2;
        this.maxX = window.innerWidth-s;
        this.maxY = window.innerHeight-s;
    }

    handleOrientation(event) {
        var easing = 0.15;
        var xAng = event.gamma;  // In degrees in the range [-180,180]
        var yAng = event.beta; // In degrees in the range [-90,90]

        // Because we don't want to have the device upside down
        // We constrain the x value to the range [-90,90]
        if (xAng >  90) { xAng =  90};
        if (xAng < -90) { xAng = -90};
        
        //calculating speed depending on the angle 
        // ang/90 -> normalize angle from -1 to 1
        // then we multiply maximum x or y coordinate times normalized angle, so we got position on the x or y axis
        // we substract size/2 so we get the position of the middle of our ball
        // then we multiply it by our easing factor, so it's slower
        let maxX = window.innerWidth-this.size;
        let maxY = window.innerHeight-this.size;
        this.xSpeed = (maxX*xAng/90 - this.size/2)*easing;
        this.ySpeed = (maxY*yAng/90 - this.size/2)*easing;
    }

    move(){
        //basic movement, every key frame we add xSpeed to x coordinate and ySpeed to y coordinate
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }

    detect(targets){
        //by default return false
        let ret = false;
        targets.forEach((t,i)=>{
                //if distance from target and player is smaller then sum of its radiuses
                if(this.distance(t)<(t.size+this.size)){
                    //return index of target and it's type (color or not)
                    //if target is current target (red color)
                    if(t.color){
                        ret = {
                            ind: i,
                            target: true
                        };
                    }else{
                        ret = {
                            ind: i,
                            target: false
                        }
                    }
                }
        });
        return ret;
    }

    distance(t){
        //calculating the distance with basic equation 
        return Math.sqrt(Math.pow(t.x-this.x, 2)+Math.pow(t.y-this.y, 2))
    }

}

