__kernel void test_stream_read_uint(
    __global uint *dst)
{
    int  tid = get_global_id(0);
    dst[tid] = ((1U<<16)+1U);
}
