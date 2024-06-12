# Build luvit and friends in one alpine container
FROM alpine AS build
RUN apk add git build-base curl cmake perl linux-headers coreutils
# Clone and build luvi
RUN git clone --recursive https://github.com/luvit/luvi.git
RUN make -C luvi regular-asm luvi test && \
  cp /luvi/build/luvi /usr/local/bin/luvi && \
  echo '#!/usr/local/bin/luvi --' > /usr/local/bin/luvi-prefix
# Clone and build lit
RUN git clone --recursive https://github.com/luvit/lit.git
RUN luvi lit -- make lit /usr/local/bin/lit /usr/local/bin/luvi-prefix
# Clone and build luvit
RUN git clone --recursive https://github.com/luvit/luvit.git
RUN lit make luvit /usr/local/bin/luvit /usr/local/bin/luvi-prefix
# Run tests
# TODO: Fix tests
# RUN cd luvit && luvit tests/run.lua


# Setup a minimal container with luvit and friends
FROM alpine as luvit
RUN apk add libgcc
COPY --from=build /usr/local/bin/luvit /usr/local/bin/luvit
COPY --from=build /usr/local/bin/luvi /usr/local/bin/luvi
COPY --from=build /usr/local/bin/lit /usr/local/bin/lit

# Setup luvit.io webserver
FROM luvit as luvi-io
WORKDIR /app
COPY package.lua .
RUN lit install
COPY . .
EXPOSE 8080
CMD ["luvit", "server.lua"]
