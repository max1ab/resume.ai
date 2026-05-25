# Use XeLaTeX (required for CJK and fontspec)
$pdf_mode = 5;

# Add templates/ to TeX search path so \usepackage{elegant-resume} resolves
# from any working directory
use File::Basename;
use Cwd 'abs_path';
my $root = dirname(abs_path(__FILE__));
$ENV{TEXINPUTS} = "$root/templates//:";
