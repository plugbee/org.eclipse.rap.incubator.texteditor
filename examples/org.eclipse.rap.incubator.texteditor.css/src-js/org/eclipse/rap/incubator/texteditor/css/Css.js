/**
 * <copyright>
 *
 * Copyright (c) 2016 PlugBee. All rights reserved.
 * 
 * This program and the accompanying materials are made available 
 * under the terms of the Eclipse Public License v1.0 which 
 * accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     Amine Lajmi - Initial API and implementation
 *
 * </copyright>
 */
(function() {
	rap.registerTypeHandler("org.eclipse.rap.incubator.texteditor.css.widget.Css", {
		factory : function(properties) {
			return new org.eclipse.rap.incubator.texteditor.css.widget.Css(properties);
		},
		destructor : "destroy",
		properties : [ "url", "text", "editable", "status", "annotations", "scope", "proposals", "font", "dirty", "markers", "background"],
		events : ["Modify", "TextChanged", "Save", "FocusIn", "FocusOut", "Selection", "CaretEvent", "ContentAssist"],
		methods : ["setSelection", "addMarker", "removeMarker", "clearMarkers", "insertText", "removeText", "setProposals", "moveCursorFileStart","moveCursorFileEnd"]
 		
	});

	rwt.qx.Class.define("org.eclipse.rap.incubator.texteditor.css.widget.Css", {
		extend :org.eclipse.rap.incubator.BasicText,

		construct : function(properties) {
			this.base(arguments, properties);
		},
		members : {
						
			createEditor : function() {
				var basePath = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/';
				ace.require("ace/config").set("basePath", basePath);
				var themePath = 'rwt-resources/src-js/org/eclipse/rap/incubator/texteditor/css';
				ace.require("ace/config").set("themePath", themePath);
				var modePath = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/';
				ace.require("ace/config").set("modePath", modePath);
				var workerPath = 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/';
				ace.require("ace/config").set("workerPath", workerPath);
				var editor = this.editor = ace.edit(this.element);
				if (editor != null) {
					var editable = this.editable;
					var guid = this.url;
			        ace.config.loadModule("ace/ext/language_tools", function (module) {
			        	editor.setOptions({
			        		mode: "ace/mode/css",
			        		theme:"ace/theme/css",
				            enableBasicAutocompletion: true,
				            enableTextCompleter: true,
				            enableKeyWordCompleter: true,
				            enableSnippets: true,
						    useWorker: true,
			            });
			        });
					editor.getSession().setUseWrapMode(true);
				    editor.getSession().setTabSize(4);
				    editor.getSession().setUseSoftTabs(true);
					editor.getSession().getUndoManager().reset();
					editor.setShowPrintMargin(false);
					editor.setBehavioursEnabled(true);
					editor.setWrapBehavioursEnabled(true);
					editor.$blockScrolling = Infinity;
					this.setFont(10);
					var self = this;
					//Content assist
					this.langTools = ace.require("ace/ext/language_tools");
					this.completers = editor.completers;
					//Text hover
					var TokenTooltip = ace.require("ace/ext/tooltip").TokenTooltip;
					editor.tokenTooltip = new TokenTooltip(editor);
					//Annotations
					if (this.annotations==null)	this.annotations=[];
					//Index
				 	index = this.scope;
				 	proposals = this.proposals;
				 	if (this.useSharedWorker) {
						if (typeof SharedWorker == 'undefined') {
							console.log("Your browser does not support Javascript shared workers, as a consequence some features will be disabled."
									+ "For a full-featured user experience, the following browsers are supported: Chrome, Firefox, Safari.");
						} else {
							var filePath = 'rwt-resources/src-js/org/eclipse/rap/incubator/basictext/global-index.js';
							var httpURL = this.computeWorkerPath(filePath);
							var worker = this.worker = new SharedWorker(httpURL);
							if (this.ready) {
								editor.on("change", function(event) {
									worker.port.postMessage({
										message: editor.getValue(),
								        guid: guid,
								        index: index
								    });
							    });
							}
							worker.port.onmessage = function(e) {
							 	index = e.data.index;
						    };
						}
				 	}
					editor.on("focus", function() {
				 		self.onFocus();
				 	});
				 	editor.on("blur", function() {
				 		self.onBlur();
				 	});
				 	editor.on("input", function() {
						if (!editor.getSession().getUndoManager().isClean())
							self.onModify();
				 	});
				 	editor.getSession().getSelection().on('changeCursor', function() {
				 	    self.onChangeCursor();
				 	});
					editor.commands.addCommand({
						name: 'saveFile',
						bindKey: {win: 'Ctrl-S', mac: 'Command-S', sender: 'editor|cli'},
						exec: function(env, args, request) {
							self.onSave();
						}
					});
				}
				//Done
		        this.onReady();
			},

			onFocus: function() {
				this.base(arguments);
			},
			
			onBlur: function() {
				this.base(arguments);
			},

			destroy : function() {
				this.base(arguments);
				if (this.langTools)
					this.langTools.resetOptions(this.editor);
			}
		}
	});
     
}());