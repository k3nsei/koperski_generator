jQuery(function() {
	$(window).load(function() {
		var queue = new createjs.LoadQueue(true);
		var stage = new createjs.Stage("generatorCanvas");

		loadAssets();

		function loadAssets() {
			queue.on("fileload", handleFileLoad, this);
	 		queue.on("complete", handleComplete, this);
	 		queue.loadFile({
				id: "logoVertical",
				src: "images/koperski-vertical-logo.png"
			});
			queue.loadFile({
				id: "logoVerticalInverted",
				src: "images/koperski-vertical-logo_inverted.png"
			});
			queue.loadFile({
				id: "patternDarkWall",
				src: "images/dark_wall.png"
			});
			queue.loadFile({
				id: "patternSubtleGrunge",
				src: "images/subtle_grunge.png"
			});
            queue.loadFile({
				id: "imgLink",
				src: "images/link.png"
			});
            queue.loadFile({
				id: "imgLinkInverted",
				src: "images/link_inverted.png"
			});
            queue.loadFile({
				id: "imgFacebook",
				src: "images/facebook.png"
			});
	 		queue.load();
		}

		function handleComplete(event) {
			initCanvas();
		}
		function handleFileLoad(event) {
			var output = event.result;
			var item = event.item;

			if(item.type === "image") {
				if(item.id) {
					output.id = item.id
				}
			}

			$("#preloadedImages").append(output);
		}

		function initCanvas() {
			// Background Part
			var backgroundG = new createjs.Graphics().beginBitmapFill($("#patternDarkWall")[0], "repeat").drawRect(0, 0, $("#generatorCanvas")[0].width, $("#generatorCanvas")[0].height);
			var background = new createjs.Shape(backgroundG);
            console.log(background);

			// Logo Part
			var logo = new createjs.Bitmap($("#logoVerticalInverted")[0]);
			var logoScale = 60 / logo.getBounds().width;
			logo.scaleX = logoScale;
			logo.scaleY = logoScale;
			logo.x = 720;
			logo.y = 20;

			// Text Part
			var text = new createjs.Text(" ");
			text.lineWidth = 600;
			text.x = 100;
			text.y = 90;
			text.font = "bold 36px Lato";
			text.textAlign = $("input:radio[name='fontAlign']:checked").val();
			text.color = "#fff";

            // Horizontal Line Part
            var hlG = new createjs.Graphics().beginFill("#2f2f2f").drawRect(0, 0, 760, 2);
            var hl = new createjs.Shape(hlG);
            hl.x = 20;
            hl.y = text.getBounds().height + 140;
            
            // Facebook Image Part
            var facebookImg = new createjs.Bitmap($("#imgFacebook")[0]);
            var facebookImgScale = 18 / facebookImg.getBounds().width;
			facebookImg.scaleX = facebookImgScale;
			facebookImg.scaleY = facebookImgScale;
			facebookImg.x = 278;
			facebookImg.y = text.getBounds().height + 152;
            
            // Link Image Part
            var linkImg = new createjs.Bitmap($("#imgLinkInverted")[0]);
            var linkImgScale = 12 / linkImg.getBounds().width;
			linkImg.scaleX = linkImgScale;
			linkImg.scaleY = linkImgScale;
			linkImg.x = 586;
			linkImg.y = text.getBounds().height + 156;
            
            // LinkText Part
            var linkText = new createjs.Text("www.facebook.com/trenerkoperski           www.trenerkoperski.pl");
            linkText.x = 778;
			linkText.y = text.getBounds().height + 150;
            linkText.font = "italic bold 18px Lato";
            linkText.color = "#fff";
            linkText.textAlign = "right";
            
			// Stage Part
			stage.addChild(background);
			stage.addChild(logo);
			stage.addChild(text);
            stage.addChild(hl);
            stage.addChild(facebookImg);
            stage.addChild(linkImg);
            stage.addChild(linkText);
			stage.update();

			// Canvas Functions
			function setFontAlign() {
				var align = $("input:radio[name='fontAlign']:checked")[0];
				if(align.value === 'left') {
					text.x = 100;
					text.textAlign = align.value;
				} else if(align.value === 'center') {
					text.x = 400;
					text.textAlign = align.value;
				} else if(align.value === 'right') {
					text.x = 700;
					text.textAlign = align.value;
				} else {
					text.x = 400;
					text.textAlign = 'center';
				}
			}

			function setText() {
                if($("input:radio[name='fontStyle']:checked").val() === 'normal') {
				text.font = "bold 36px Lato";
                } else if($("input:radio[name='fontStyle']:checked").val() === 'italic') {
                    text.font = "italic bold 36px Lato";
                }
				var textarea = $("#genText")[0];
				if(!!(textarea.value)) {
					text.text = textarea.value;
				} else {
					text.text = ' ';
				}
			}
            
            function setFooter() {
                hl.y = text.getBounds().height + 140;
                facebookImg.y = text.getBounds().height + 152;
                linkImg.y = text.getBounds().height + 156;
                linkText.y = text.getBounds().height + 150;
            }

			function refreshCanvas() {
                setFontAlign();
				setText();
                setFooter();

				var canvasHeight = (text.getBounds().height) ? ((90 * 2) + text.getBounds().height) : (90 * 2);
                backgroundG.rect(0, 0, $("#generatorCanvas")[0].width, canvasHeight);
				$("#generatorCanvas")[0].height = canvasHeight;
				stage.update();
			}
            
			// Events Handler
			$("#previewButton").on("click", function() {
				refreshCanvas();
			});

			$("#downloadButton").on("click", function() {
				refreshCanvas();
				downloadCanvas($("#downloadButton")[0], 'generatorCanvas', new Date().getTime() + '.png');
			});
		}

		function downloadCanvas(link, canvasId, filename) {
    		link.href = document.getElementById(canvasId).toDataURL();
    		link.download = filename;
		}
	});
});
