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
package org.eclipse.rap.incubator.texteditor.html.widget;

import static org.eclipse.rap.rwt.RWT.getClient;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.core.runtime.IPath;
import org.eclipse.core.runtime.Path;
import org.eclipse.rap.incubator.basictext.BasicText;
import org.eclipse.rap.rwt.client.service.ClientFileLoader;
import org.eclipse.rap.rwt.remote.Connection;
import org.eclipse.rap.rwt.remote.RemoteObject;
import org.eclipse.swt.widgets.Composite;

public class Html extends BasicText {

	private static final long serialVersionUID = 332789348346228978L;

	public static final String REMOTE_TYPE = "org.eclipse.rap.incubator.texteditor.html.widget.Html";
	
	private static final String ACE_MODE_KEY = "org.eclipse.rap.incubator.basictext.ace.mode-html";
	private static final String ACE_MODE_VALUE = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/mode-html.js";
	private static final String ACE_WORKER_KEY = "org.eclipse.rap.incubator.basictext.ace.worker-html";
	private static final String ACE_WORKER_VALUE = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.6/worker-css.js";

	public Html(Composite parent, int style) {
		super(parent, style);
	}
	
	@Override
	protected RemoteObject createRemoteObject(Connection connection) {
		return connection.createRemoteObject(REMOTE_TYPE);
	}
	
	@Override 
	protected void setupClient() {
		super.setupClient();
		getClient().getService(ClientFileLoader.class).requireJs(System.getProperty(ACE_MODE_KEY, ACE_MODE_VALUE));
		getClient().getService(ClientFileLoader.class).requireJs(System.getProperty(ACE_WORKER_KEY, ACE_WORKER_VALUE));
		List<IPath> languageResources = new ArrayList<IPath>();
		languageResources.add(new Path("src-js/org/eclipse/rap/incubator/texteditor/html/theme-html.js"));
		registerJsResources(languageResources, getClassLoader());
		loadJsResources(languageResources);
	}

	@Override
	protected ClassLoader getClassLoader() {
		ClassLoader classLoader = Html.class.getClassLoader();
		return classLoader;
	}
}