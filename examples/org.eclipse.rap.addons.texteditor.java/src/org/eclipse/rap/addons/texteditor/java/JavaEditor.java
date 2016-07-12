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
 * </copyright>
 */
package org.eclipse.rap.addons.texteditor.java;

import org.apache.log4j.Logger;
import org.eclipse.rap.addons.basictext.BasicText;
import org.eclipse.rap.addons.texteditor.BasicTextEditor;
import org.eclipse.rap.addons.texteditor.java.widget.Java;
import org.eclipse.swt.SWT;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.widgets.Composite;

public class JavaEditor extends BasicTextEditor {

	static final Logger logger = Logger.getLogger(JavaEditor.class);
	
	protected String languageName;
	
	/**
	 * Default constructor
	 */
	public JavaEditor() {
		super();
	}

	/**
	 * Creates and initializes the text widget
	 */
	@Override
	protected BasicText createTextWidget(Composite parent, int style) {
		Java textWidget = new Java(parent, style);
		GridData textLayoutData = new GridData();
		textLayoutData.horizontalAlignment = SWT.FILL;
		textLayoutData.verticalAlignment = SWT.FILL;
		textLayoutData.grabExcessHorizontalSpace = true;
		textLayoutData.grabExcessVerticalSpace = true;
		textWidget.setLayoutData(textLayoutData);
		textWidget.setEditable(true);
		return textWidget;
	}

	@Override
	public void createCompletionProposals(final int offset) {
	}

	public void setLanguageName(String name) {
		this.languageName = name;
	}

	public String getLanguageName() {
		return languageName;
	}
}