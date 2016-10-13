from IPython.html.widgets import DOMWidget
from IPython.utils.traitlets import Unicode, Int

class FileSelector(DOMWidget):
    _view_module = Unicode('nbextensions/ipython_file_selector/ipython_file_selector', sync=True)
    _view_name = Unicode('IPFileSelector', sync=True)
    count = Int(sync=True)
