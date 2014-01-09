__kernel void test_stream_read_long(
    __global long *dst)
{
    dst[0] = ((1LL<<32)+1LL);
}
