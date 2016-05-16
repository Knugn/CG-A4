cmake_minimum_required(VERSION 2.6.0)

# Specify project name
project(raycaster)

# Set extra compiler flags
if(UNIX AND NOT APPLE)
  set(CMAKE_CXX_FLAGS "-W -Wall -std=c++0x")
endif(UNIX AND NOT APPLE)
if(APPLE)
  set(CMAKE_CXX_FLAGS "-W -Wall -std=c++0x -ObjC++")
endif(APPLE)

# Add source directories
aux_source_directory("${CMAKE_CURRENT_SOURCE_DIR}/src" raycaster_SRCS)

# Add include directories
include_directories("${CMAKE_CURRENT_SOURCE_DIR}/src")

# Create variable for required libraries
set(requiredLibs)

# GLFW
add_subdirectory("${CMAKE_CURRENT_SOURCE_DIR}/../external/glfw" ${CMAKE_CURRENT_BINARY_DIR}/glfw)
include_directories(SYSTEM "${CMAKE_CURRENT_SOURCE_DIR}/../external/glfw/include")

# OpenGL
find_package(OpenGL REQUIRED)
if(OPENGL_FOUND)
  include_directories( SYSTEM ${OPENGL_INCLUDE_DIR})
  set(requiredLibs ${requiredLibs} ${OPENGL_LIBRARIES})
endif(OPENGL_FOUND)

# GLEW
aux_source_directory("${CMAKE_CURRENT_SOURCE_DIR}/../external/glew/src" raycaster_SRCS)
include_directories(SYSTEM "${CMAKE_CURRENT_SOURCE_DIR}/../external/glew/include")
add_definitions(-DGLEW_STATIC)

# GLM
include_directories(SYSTEM "${CMAKE_CURRENT_SOURCE_DIR}/../external/glm")

# lodepng
aux_source_directory("${CMAKE_CURRENT_SOURCE_DIR}/../external/lodepng" raycaster_SRCS)
include_directories(SYSTEM "${CMAKE_CURRENT_SOURCE_DIR}/../external/lodepng")

# AntTweakBar (uncomment to enable)
#aux_source_directory("${CMAKE_CURRENT_SOURCE_DIR}/../external/anttweakbar/src" raycaster_SRCS)
#include_directories(SYSTEM "${CMAKE_CURRENT_SOURCE_DIR}/../external/anttweakbar/include")
#include_directories(SYSTEM "${CMAKE_CURRENT_SOURCE_DIR}/../external/anttweakbar/src")
#add_definitions(-DTW_STATIC -DTW_NO_LIB_PRAGMA)
#if(UNIX AND NOT APPLE)
#  add_definitions(-D_UNIX)
#endif(UNIX AND NOT APPLE)
#if(APPLE)
#  add_definitions(-D_MACOSX)
#endif(APPLE)
#add_definitions(-DWITH_TWEAKBAR)

# Create build files for executable
add_executable(raycaster ${raycaster_SRCS})

# Link against libraries
target_link_libraries(raycaster glfw ${requiredLibs} ${GLFW_LIBRARIES})

# Install executable
install(PROGRAMS ${CMAKE_CURRENT_BINARY_DIR}/raycaster DESTINATION bin)

# Specify build type
set(CMAKE_BUILD_TYPE Release)
