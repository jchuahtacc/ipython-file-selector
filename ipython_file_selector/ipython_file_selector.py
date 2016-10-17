from ipywidgets import DOMWidget
from traitlets import Unicode, Int, observe
import os

class IPFileSelector(DOMWidget):
    _view_module = Unicode('nbextensions/ipython_file_selector/ipython_file_selector', sync=True)
    _view_name = Unicode('IPFileSelector', sync=True)
    home_path = Unicode(os.getcwd()).tag(sync=True)
    current_path = Unicode(os.getcwd()).tag(sync=True)
    count = Int(555).tag(sync=True)

    def __init__(self, *args, **kwargs):
        super(IPFileSelector, self).__init__(*args, **kwargs)
        self.on_msg(self.handleMsg)

    def handleMsg(self, widget, content, buffers=None):
        #print(content['type'])
        msg = dict()
        msg["type"] = "echo"
        #self.send(msg)
        self.current_path = "blah"

    @observe('count')
    def count_changed(self, change):
        print(dir(change))

