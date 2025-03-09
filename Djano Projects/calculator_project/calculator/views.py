from django.shortcuts import render
from django import forms
import re

class CalculatorForm(forms.Form):
    expression = forms.CharField(label='Enter Expression', max_length=100)

def evaluate_expression(expression):
    try:
        if not re.match(r'^[0-9+\-*/(). ]+$', expression):
            return "Invalid Input"
        result = eval(expression, {"__builtins__": None}, {})
        return result
    except Exception as e:
        return "Error"

def calculator_view(request):
    result = None
    form = CalculatorForm()

    if request.method == 'POST':
        form = CalculatorForm(request.POST)
        if form.is_valid():
            expression = form.cleaned_data['expression']
            result = evaluate_expression(expression)

    return render(request, 'calculator.html', {'form': form, 'result': result})
