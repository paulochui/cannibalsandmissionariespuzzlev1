	var left=[];
	var right=['m3','m2','m1','p3','p2','p1'];
	var move=true;						
	var s_r=0;
	var boat=[];
	var selected;
	var timer;
	var re = 1300; /*1300*/
	var sec= 0;
	var birds_pos=1220;
	var le =0;
	var moves = 0; // Variable para contar los movimientos

	

	(function(){
		var birds = document.getElementById("birds");
		birds.style.position = "absolute";
		birds.style.top = "70px";
		var time = document.getElementById("timer");
		timer=setInterval(function(){
			sec++;
			time.innerHTML=Math.floor(sec/100)+":"+(sec%100);
			if(birds_pos<0)
				birds_pos=1220;
			birds.style.left=(birds_pos-=1)+"px";
		},10);

	})();

	var setleft = function() {
		for (var i = 0; i < left.length; i++) {
			document.getElementById(left[i]).style.left = le+"px";
			le+=70;
		}
		le=0;
	};

	var setright = function() {
		for (var i = 0; i < right.length; i++) {
			document.getElementById(right[i]).style.left = (re-=70)+"px";
		}
		re=1300; //1300
	};
	setright();

	var on_click = function(tag) {
		if(move==true)
		{
			rightmove(tag);
		}
		else if(move==false)
		{
			leftmove(tag);
		}
		moves++; // Incrementar el contador de movimientos
		updateMovesCounter(); // Actualizar el contador de movimientos en la interfaz
	};

	var rightmove = function(tag) {
		var b_pos = boat.indexOf(tag);
		if(b_pos!=-1)
		{
			s_r--;
			right.push(tag);
			boat.splice(b_pos,1);
			setright();
		}
		
		var r_pos = right.indexOf(tag);
		if(r_pos!=-1 && b_pos==-1 && boat.length!=2)
		{
			s_r++;
			boat.push(tag);
			right.splice(r_pos,1);
			boat_transition(tag);
		}
		
	};

	var leftmove = function(tag) {
		
		var b_pos = boat.indexOf(tag);
		if(b_pos!=-1)
		{
			s_r--;
			left.push(tag);
			boat.splice(b_pos,1);
			setleft();
		}
		var l_pos = left.indexOf(tag);
		if(l_pos!=-1 && b_pos==-1 && boat.length!=2)
		{
			s_r++;
			boat.push(tag);
			left.splice(l_pos,1);
			boat_transition(tag);
			
		}	
		
	};

	var won = function() {
		
		var p=0;
		var m=0;
		for(var i=0;i<left.length;i++)
		{
			var s=left[i].charAt(0);
			if(s=='m')
				m++;
			else
				p++;
		}
		if(move==false)
		for(var i=0;i<boat.length;i++)
		{
			var s=boat[i].charAt(0);
			if(s=='m')
				m++;
			else
				p++;
		}
		if((p+m)==6)
		{
			move='a';
			clearInterval(timer);
			var ids = document.getElementById("game_op");
			ids.src="image/congratulation.jpeg";
			ids = document.getElementById("game_over");
			ids.style.visibility="visible";
			console.log(sec);
			ids = document.getElementById("time");
			ids.value = Math.floor(sec/100)+":"+(sec%100);
			return true;
		}
		return false;
	};

	var gameOver = function() {
		var a = game();
		if(a==true)
		{
			clearInterval(timer);
			move='a';
			var ids = document.getElementById("game_over");
			ids.style.visibility="visible";
			
			return true;
		}
		return false;
	};


	var game=function() {
		var p=0;
		var m=0;
		for(var i=0;i<left.length;i++)
		{
			var s=left[i].charAt(0);
			if(s=='m')
				m++;
			else
				p++;
		}
		if(move==false)
		for(var i=0;i<boat.length;i++)
		{
			var s=boat[i].charAt(0);
			if(s=='m')
				m++;
			else
				p++;
		}
		
		if(m>p && m!=0 && p!=0)
		{
			return true;
		}
		p=0;
		m=0;
		for(var i=0;i<right.length;i++)
		{
			var s=right[i].charAt(0);
			if(s=='m')
				m++;
			else
				p++;
		}
		if(move==true)
		for(var i=0;i<boat.length;i++)
		{
			var s=boat[i].charAt(0);
			if(s=='m')
				m++;
			else
				p++;
		}
		

		if(m>p && m!=0 && p!=0)
		{
			return true;
		}
		return false;
	}

	var boat_transition =function(tag){
		
		var boat_pos = document.getElementById("boat").getBoundingClientRect().left;
		
		if(boat.length==1)
		{
			var p = document.getElementById(boat[0]);
			p.style.left=(Number(boat_pos)+10)+"px";
		}
		if(boat.length==2)
		{
			p = document.getElementById(boat[0]);
			p.style.left=(Number(boat_pos)+110)+"px";
			p = document.getElementById(boat[1]);
			p.style.left=(Number(boat_pos)+10)+"px";
		}
	};

	var move_button = function(){
		if(!boat.length==0)
		{	
			
			var boat_p = document.getElementById("boat");
			var b=boat_p.getBoundingClientRect().left;
			if(b==370)		
			{
				move=true;
				boat_p.style.left = 700+"px";
				for (var i = 0; i < boat.length; i++) {
					var ids = document.getElementById(boat[i]);
					ids.style.left=ids.getBoundingClientRect().left+330+"px";
				}
			}
			else
			{
				move=false;
				boat_p.style.left = 370+"px";
				for (var i = 0; i < boat.length; i++) {
					var ids = document.getElementById(boat[i]);
					ids.style.left=ids.getBoundingClientRect().left-330+"px";
				}
			}
			setTimeout(function(){
				var fk=won();
				if(!fk)
				{
					gameOver();
				}	
			},105);
			updateMovesCounter(); // Actualizar el contador de movimientos en la interfaz		
		}
		else
		{
			alert("🚧Se requiere un conductor para manejar la barca🚧❗❗");
		}
	};

	var boat_val = function(){
		var length = boat.length;
		if(length==0)
		{
			return true;
		}
		else if (length>=2) 
		{
			return true;
		}
		return false;
	};

	function updateMovesCounter() {
		document.getElementById("cont").innerHTML = moves;
	}

	var header = document.getElementById('Header');
	window.addEventListener('scroll',()=>{

		var scroll = window.scrollY
		if(scroll>10){
			header.style.backgroundColor = 'rgba(255, 255, 215, 0.2)'
		}else{
			
			header.style.background= 'rgba(255, 255, 255, 0.2)'
		}
	})