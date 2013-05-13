__kernel void test_stream_read_ushort(
    __global ushort *dst)
{
    int  tid = get_global_id(0);
    dst[tid] = (unsigned short)((1<<8)+1);
}
