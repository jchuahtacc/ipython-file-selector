from ipywidgets import DOMWidget
from traitlets import Unicode, Int

class IPFileSelector(DOMWidget):
    _view_module = Unicode('nbextensions/ipython_file_selector/ipython_file_selector', sync=True)
    _view_name = Unicode('IPFileSelector', sync=True)
    count = Int(sync=True)
