function NumberTrain(name){
	this.name=name;
}

NumberTrain.prototype.val= function(input){
	return this.answer===input
}

NumberTrain.prototype.show =function(where){
	var chal=this;
	var r=Math.floor(Math.random()*20);
	r=r<=3?r+3:r==20?r-1:r;	
	this.train=[r-2,r-1,r,r+1];
	var html='<div>';	
	var k=Math.floor(Math.random()*3);
	var ans=this.train[k];
	for(var i = 0; i < 4; i++ ){
			var imgName="trainnum_"+this.train[i]+".PNG";
			if(i==k){
			html+="<img src=qm.jpg id='questionmark' width=280px height=300px"+"/>";
			}else{
			html+="<img src="+imgName+" width=280px height=300px"+"/>";
			}
	}
	html+="</div>";
	var hinthtml='<div>';
	var h1=ans;
	while(h1==ans || h1<=1){
		h1=Math.floor(Math.random()*20);		
	}

	var h2=ans;
	while(h2==ans || h2<=1 || h2==h1){
		h2=Math.floor(Math.random()*20);		
	}

	this.hints=[h1,h2];
	var p=Math.floor(Math.random()*2);
	var handles=[];

	for(var i = 0; i < 3; i++ ){
			var imgName='';
			var imgid='';
			if(i==p){
				imgName="trainnum_"+ans+".PNG";
				imgid=ans;
			}else{
				var num=i%this.hints.length;
				imgName="trainnum_"+this.hints[num]+".PNG";
				imgid=this.hints[num];
			}
			handles.push(imgid);
			hinthtml+="<img src="+imgName+ " id=\""+imgid+"\""+" width='200px' height='150px' class=\"spaced\""+"/>";			
	}
	
	hinthtml+="</div>"
	where.innerHTML=html+hinthtml;	
	for(var i = 0; i < handles.length; i++ ){
	var handle=document.getElementById(handles[i]);
			handle.onclick=function(event){
				if(ans==this.id){
					var qm=document.getElementById('questionmark');
					qm.src="trainnum_"+ans+".PNG";
					event.challengepass="pass";
					
				}else{
					event.challengefail="fail";
				}			
			};
	}

}

 function sleep(delay)
 {
     var start = new Date().getTime();
     while (new Date().getTime() < start + delay);
 }


function Controller(numbertrain,chalCanvas,resCan){
	this.elem=document.getElementById("controller");
	this.numbertrain=numbertrain;
	this.challengeCanvas=chalCanvas;
	this.resultCanvas=resCan;
	
	var that=this;
	this.elem.onclick=function(event){
		var res=document.getElementById("result")
		var html='';
		
		if(event.challengepass){
			that.showResult(true);
			setTimeout(that.showNext,2000);
		}
		if(event.challengefail){
			that.showResult(false);		
			}
		};
	

 }

 Controller.prototype.next=function(){
	return  1;
 }
 Controller.prototype.showNext=function(){
	if(this.next){
		this.resultCanvas.innerHTML='';
		this.numbertrain.show(this.challengeCanvas);
	}else{
		ctr=this.controller;
		ctr.resultCanvas.innerHTML='';
		ctr.numbertrain.show(ctr.challengeCanvas);
	}
 }
 Controller.prototype.showCurrent=function(){
	ctr.numbertrain.show(this.challengeCanvas);
 }

 Controller.prototype.showResult=function(pass){
 var html='';
			if(pass){
				html+='<div><img src=../good.jpg/></div>';
				this.resultCanvas.innerHTML=html;				
			}else
				{
				html+='<div><img src=../poor.jpg/></div>';
				this.resultCanvas.innerHTML=html;
			}


 }

 