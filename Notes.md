
* To investigate - Alternate way of creating a copy of the container
    * Might be faster
* Get the inspect object of a container 
  * `docker inspect <container-id>`
* Get the content of the container
  * `docker export <container-id> -o /path/to/tar/file`
* Generate a manifest of the images from the inspect output
  * Import the manifest into docker as an image
  * Upload the export to the new image