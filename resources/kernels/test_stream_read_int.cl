__kernel void test_stream_read_int(
    __global int *dst)
{
    int  tid = get_global_id(0);
    dst[tid] = ((1<<16)+1);
}
