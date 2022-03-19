static mut CTRLC_HIT: bool = false;

#[no_mangle]
pub fn ctrlc_hit() -> u8 {
    (unsafe { CTRLC_HIT }) as u8
}

#[no_mangle]
pub fn reset_flag() {
    unsafe { CTRLC_HIT = false }
}

#[no_mangle]
pub fn set_handler() {
    ctrlc::set_handler(move || unsafe { CTRLC_HIT = true }).expect("Error setting Ctrl-C handler");
}
