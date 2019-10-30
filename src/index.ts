// Distributed under the terms of the Modified BSD License.

import {
  IFrame, MainAreaWidget, WidgetTracker, ICommandPalette
} from '@jupyterlab/apputils';

import {
  ILayoutRestorer, JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
    IMainMenu
} from '@jupyterlab/mainmenu';

/**
 * The command IDs used by the plugin.
 */
namespace CommandIDs {
  export const ipumsMetadata: string = 'menuextender:ipums-metadata-docs';
}

const category = "Help"
const HELP_CLASS = "jp-Help"

const RESOURCES = [
  {
    text: 'ipums-metadata API docs',
    url: 'https://pages.github.umn.edu/mpc/ipums-metadata/1.43.0/'
  },
];

RESOURCES.sort((a: any, b: any) => {
  return a.text.localeCompare(b.text);
});

/**
* Create a new HelpWidget widget.
*/
function newHelpWidget(url: string, text: string): MainAreaWidget<IFrame> {
    // Allow scripts and forms so that things like
    // readthedocs can use their search functionality.
    // We *don't* allow same origin requests, which
    // can prevent some content from being loaded onto the
    // help pages.
    let counter = 0
    const namespace = 'help-doc';
    let content = new IFrame({
      sandbox: ['allow-scripts', 'allow-forms']
    });
    content.url = url;
    content.addClass(HELP_CLASS);
    content.title.label = text;
    content.id = `${namespace}-${++counter}`;
    let widget = new MainAreaWidget({ content });
    widget.addClass('jp-Help');
    return widget;
}

/**
 * Activate the jupyter-menuextender extension.
 */
function activateMenuextenderExtension(app: JupyterFrontEnd,
                                       palette: ICommandPalette,
                                       mainMenu: IMainMenu,
                                       restorer: ILayoutRestorer): void {

  const resourcesGroup = RESOURCES.map(args => ({
    args,
    command: CommandIDs.ipumsMetadata
  }));

  const namespace = 'jupyter-menuextender';
  const { commands, shell } = app;
  const tracker = new WidgetTracker<MainAreaWidget<IFrame>>({ namespace });
  const helpMenu = mainMenu.helpMenu;

  // Handle state restoration.
  if (restorer) {
    void restorer.restore(tracker, {
      command: CommandIDs.ipumsMetadata,
      args: widget => ({
        url: widget.content.url,
        text: widget.content.title.label
      }),
      name: widget => widget.content.url
    });
  }
  helpMenu.addGroup(resourcesGroup, 100);

  commands.addCommand(CommandIDs.ipumsMetadata, {
    label: args => args['text'] as string,
    execute: args => {
      const url = args['url'] as string;
      const text = args['text'] as string;

      let widget = newHelpWidget(url, text);
      void tracker.add(widget);
      shell.add(widget, 'main');
      return widget;
    }
  });

  if (palette) {
    console.log("let's add some commands, shall we?")
    RESOURCES.forEach(args => {
      palette.addItem({ args, command: CommandIDs.ipumsMetadata, category });
    });
  }

}


/**
 * Initialization data for the jupyterlab-menuextender extension.
 */
const menuextenderExtention: JupyterFrontEndPlugin<void> = {
  activate: activateMenuextenderExtension,
  id: 'jupyter.extensions.jupyterlab-menuextender',
  requires: [
    ICommandPalette,
    IMainMenu,
    ILayoutRestorer
  ],
  autoStart: true,
};

export default menuextenderExtention;

