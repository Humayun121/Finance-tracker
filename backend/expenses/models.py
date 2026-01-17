from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name
    
class Expense(models.Model):
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="expenses"
    )
    description = models.CharField(max_length=225, blank=True)
    date = models.DateTimeField()

    def __str__(self):
        return f"{self.category.name} - £{self.amount}"