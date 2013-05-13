__kernel void test_stream_read_long(
    __global long *dst)
{
    int  tid = get_global_id(0);
    dst[tid] = ((1LL<<32)+1LL);
}
