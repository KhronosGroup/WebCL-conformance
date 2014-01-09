__kernel void test_stream_read_ulong(
    __global ulong *dst)
{
    dst[0] = ((1ULL<<32)+1ULL);
}
