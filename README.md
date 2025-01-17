# Sumary
This is a cache preview webpage created for the _Arquitectura de Computadors_ subject at _Universitat de les Illes Balears_. It is used to display how a multilevel cache works in order to archieve a better CPI on the CPU and
depending on the cache type how the items are stored inside. 
The webpage will provide a "video" mode to display each memory access so the user can go back and foward and see each action in real time.

# Usage
The page is a node project so to run it you will have to execute the following command, this will donwload all the dependencies and will open the webpage on 
the *localhost:1011*
```
node run start
```

When the server is on you will see something like the image bellow:\
![Webpage preview](https://github.com/Brouse13/CacheManager/blob/master/images/preview.png)
1) **Change Settings**: Click here to change the cache or the memory settings
2) **Memory Preview**: You can see all the memory content, it is initialized with random data
3) **Cache Preview**: You can see all the cache content of each cache
4) **Controls**: You can go back/foward on the memory accesses and the changes will be reflected on the cache preview
5) **Memory Access**: You can see all the memory accesses with the respective hit/miss on the cache, only when executed the access with the controls
6) **Stats**: Show the CPI, Hits, Misses of each cache
