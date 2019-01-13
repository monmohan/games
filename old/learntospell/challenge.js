function Challenge(name,answer,hints){
	this.name=name;
	this.answer=answer;
	this.hints=hints;
}

Challenge.prototype.val= function(input){
	return this.answer===input
}

Challenge.prototype.show =function(where){
	var chal=this;
	var r=Math.floor(Math.random()*chal.answer.length);
	var html='';
	
	html+="<div id=\"chars\"><img src="+chal.hints+" width=350 height=350/></br><br>";
	var ans='';
	for(var i = 0; i < chal.answer.length; i++ ){
		var show='';
		if(i!=r){
			show+=chal.answer.charAt(i);		
			html+="<input size=3 maxlength=1 disabled=true value="+show+"></input>";
		}else{
			ans=show;
			html+="<input size=3 maxlength=1 id=\"fc\" value="+show+"></input>";
	    }
	}
	html+="</div>"
	
	where.innerHTML=html;
	var fc=document.getElementById("fc");

	fc.onkeyup=function(e){
		var inp=chal.answer.substring(0,r)+fc.value.toUpperCase()+chal.answer.substring((r+1),chal.answer.length);
		var ok=chal.val(inp);		
		if(ok){
			fc.value=fc.value.toUpperCase();
			fc.style.disable="true";
			fc.blur();		
			e.challengepass="pass";
		}else{			
			e.challengefail="fail";
		}
	}
	fc.focus();
	
}

 function sleep(delay)
 {
     var start = new Date().getTime();
     while (new Date().getTime() < start + delay);
 }

 function Controller(challenges, chalCanvas,resCan){
	this.elem=document.getElementById("controller");
	this.challenges=challenges;
	this.current=-1;
	this.challengeCanvas=chalCanvas;
	this.resultCanvas=resCan;
	var that=this;
	this.elem.onkeyup=function(event){
		var res=document.getElementById("result")
		var html='';
		
		if(event.challengepass){
			that.showResult(true);
			setTimeout(that.showNext,2000);
		}
		if(event.challengefail){
			that.showResult(false);
			that.showCurrent();
			}
		};
	

 }

 Controller.prototype.next=function(){
	n=(this.current+1)%this.challenges.length;
	this.current=n;
	return n;
 }
 Controller.prototype.showNext=function(){
	if(this.next){
	this.resultCanvas.innerHTML='';
	this.challenges[this.next()].show(this.challengeCanvas);
	}else{
		ctr=this.controller;
		ctr.resultCanvas.innerHTML='';
		ctr.challenges[ctr.next()].show(ctr.challengeCanvas);
	}
 }
 Controller.prototype.showCurrent=function(){
	this.challenges[this.current].show(this.challengeCanvas);
 }

 Controller.prototype.showResult=function(pass){
 var html='';
			if(pass){
				html+='<div><img src=good.jpg/></div>';
				this.resultCanvas.innerHTML=html;				
			}else
				{
				html+='<div><img src=poor.jpg/></div>';
				this.resultCanvas.innerHTML=html;
			}


 }


