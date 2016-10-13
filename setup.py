# -*- coding: utf-8 -*-
from __future__ import print_function
from setuptools import setup
try:
    from jupyterpip import cmdclass
except:
    import pip, importlib
    pip.main(['install', 'jupyter-pip']); cmdclass = importlib.import_module('jupyterpip').cmdclass

setup(
    name='ipython_file_selector',
    version='0.1',
    description='',
    author='',
    author_email='',
    license='',
    url='https://github.com/jchuahtacc/ipython-file-selector',
    keywords='python ipython javascript widget mywidget',
    classifiers=['Development Status :: 4 - Beta',
                 'Programming Language :: Python',
                 'License :: OSI Approved :: MIT License'],
    packages=['ipython_file_selector'],
    include_package_data=True,
    install_requires=["jupyter-pip"],
    cmdclass=cmdclass('ipython_file_selector'),
)
