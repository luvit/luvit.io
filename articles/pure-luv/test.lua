dofile 'luvit-loader.lua'
print(require('luv')) -- Require luv directly using package.cpath
print(require('uv')) -- Require luv indirectly using deps/uv.lua shim
