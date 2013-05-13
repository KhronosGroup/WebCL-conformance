__kernel void test_stream_read_short(
    __global short *dst)
{
    int  tid = get_global_id(0);
    dst[tid] = (short)((1<<8)+1);
}
