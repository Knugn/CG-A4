#!/bin/bash

if [ -z "$ASSIGNMENT4_ROOT" ]
then
    echo "ASSIGNMENT4_ROOT is not set"
    exit 1
fi

export RAYCASTER_ROOT=$ASSIGNMENT4_ROOT/raycaster && \

# Generate build script
cd $RAYCASTER_ROOT && \
if [ ! -d build ]; then
    mkdir build
fi
cd build && \
cmake ../ -DCMAKE_INSTALL_PREFIX=$RAYCASTER_ROOT && \

# Build and install the program
make -j4 && \
make install && \

# Run the program
cd ../bin && \
./raycaster
