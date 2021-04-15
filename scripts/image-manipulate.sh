#!/bin/bash

CWD=$(pwd)

KEG_IMG_NAME=<my-image-name>
KEG_IMG_TAG=<my-image-tag>
KEG_FROM_TAR=$CWD/from.tar
KEG_OUT_TAR=$CWD/out.tar
KEG_TMP_DIR=$CWD/tmp

if [ "$KEG_IMG_TAG" ]; then
  KEG_IMG_NAME = "$KEG_IMG_NAME:$KEG_IMG_TAG"
fi

# Save the docker image as a tar
docker save $KEG_IMG_NAME -o $KEG_FROM_TAR

# Make a temp dir to store the data in
mkdir $KEG_TMP_DIR

# Export the tar into the temp folder
tar xf $KEG_FROM_TAR -C $KEG_TMP_DIR

# Move to the temp directory and modify the data in some way
cd $KEG_TMP_DIR

# Rebuild the tar from the update temp folder data
tar cf $KEG_OUT_TAR .

# Go back to the orginal directory
cd $CWD

# Load the update tar back into docker as an image
docker load -i $KEG_OUT_TAR

# Clean up, and remove the temp dir and the out.tar
# No longer neeeded now that it's loaded back into docker as an image
rm -rf $KEG_TMP_DIR
rm -rf $KEG_OUT_TAR

