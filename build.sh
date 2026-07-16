# lz est nécessaire pour compilé avec la compression Crow (voir core.cpp)

# sans upx
#g++ -std=c++20 -o run source/core.cpp -lz

# avec upx
g++ -std=c++20 -Os -s -ffunction-sections -fdata-sections -Wl,--gc-sections -o run source/core.cpp -lz && upx --ultra-brute run

