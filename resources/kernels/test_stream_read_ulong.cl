__kernel void test_stream_read_ulong(
    __global ulong *dst)
{
    int  tid = get_global_id(0);
    dst[tid] = ((1ULL<<32)+1ULL);
}
