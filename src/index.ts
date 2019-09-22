import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';


/**
 * Initialization data for the jupyterlab-menuextender extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-menuextender',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-menuextender is activated!');
  }
};

export default extension;
